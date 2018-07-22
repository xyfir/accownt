const validate = require('lib/service/validate');
const mysql = require('lib/mysql');

/*
  PUT /api/dashboard/developer/services/:id
  REQUIRED
    name: string, description: string, urlMain: string, urlLogin: string
  OPTIONAL
    urlUnlink: string
  RETURN
    { message: string }
*/
module.exports = async function(req, res) {
  const db = new mysql(),
    b = req.body;

  try {
    validate(req.body);

    await db.getConnection();

    const sql = `
      UPDATE services SET
        name = ?, description = ?, url_main = ?, url_login = ?,
        url_unlink = ?
      WHERE id = ? AND owner = ?
    `,
      vars = [
        b.name,
        b.description,
        b.urlMain,
        b.urlLogin,
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
