const buildInfo = require('lib/service/build-info');
const validate = require('lib/service/validate');
const mysql = require('lib/mysql');

/*
  PUT /api/dashboard/developer/services/:id
  REQUIRED
    info: json-string
      {fname:{optional:bool,required:bool,value:string},lname:{...},...}
    name: string, description: string, urlMain: string, urlLogin: string
  OPTIONAL
    urlUpdate: string, urlUnlink: string
  RETURN
    { error: bool, message: string }
*/
module.exports = async function(req, res) {
  const db = new mysql(),
    b = req.body;

  try {
    validate(req.body);

    await db.getConnection();

    const sql = `
      UPDATE services SET
        name = ?, description = ?, info = ?, url_main = ?, url_login = ?,
        url_update = ?, url_unlink = ?
      WHERE id = ? AND owner = ?
    `,
      vars = [
        b.name,
        b.description,
        buildInfo(b.info),
        b.urlMain,
        b.urlLogin,
        b.urlUpdate,
        b.urlUnlink,
        req.params.id,
        req.session.uid
      ],
      result = await db.query(sql, vars);

    db.release();

    if (!result.affectedRows) throw 'An unknown error occured';

    res.status(200).json({});
  } catch (err) {
    db.release();
    res.status(400).json({ message: err });
  }
};
