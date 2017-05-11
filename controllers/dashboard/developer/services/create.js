const buildInfo = require('lib/service/build-info');
const validate = require('lib/service/validate');
const mysql = require('lib/mysql');

/*
  POST api/dashboard/developer/services
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
  
  const db = new mysql(), b = req.body;

  try {
    validate(b);

    await db.getConnection();

    let sql = `
      SELECT * FROM services WHERE name = ?
    `,
    vars = [
      b.name
    ];

    const rows = await db.query(sql, vars);

    if (rows.length > 0) throw 'A service with that name already exists';
    
    sql = `
      INSERT INTO services SET ?
    `;
      
    const insert = {
      info: buildInfo(b.info),
      xyfir: req.session.uid < 1000, owner: req.session.uid,
      name: b.name, description: b.description, url_main: b.urlMain,
      url_login: b.urlLogin, url_update: b.urlUpdate, url_unlink: b.urlUnlink
    },
    result = await db.query(sql, insert);

    db.release();
      
    if (!result.affectedRows) throw 'An unknown error occured';
    
    res.json({ error: false });
  }
  catch (err) {
    db.release();
    res.json({ error: true, message: err });
  }

}