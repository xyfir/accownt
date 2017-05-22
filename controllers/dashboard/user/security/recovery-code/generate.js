const rstring = require('randomstring');
const mysql = require('lib/mysql');
const rword = require('rword');
const rand = require('lib/rand');

/*
  PUT api/dashboard/user/security/recovery-code
  REQUIRED
    type: 'custom|wordsnumbers|rstring'
  OPTIONAL
    recovery: string, count: number, strLength: number
  RETURN
    { error: bool, message?: string, recovery?: string }
*/
module.exports = async function(req, res) {

  const db = new mysql();

  try {
    const recovery = (() => {
      switch (req.body.type) {
        case 'custom':
          return String(req.body.recovery).substr(0, 4096);
        
        case 'wordsnumbers':
          const count = req.body.count > 500 ? 500 : +req.body.count || 10;
          let temp = '';
          
          for (let i = 0; i < count; i++) {
            if (rand(0, 1) == 0) temp += ' ' + rword.generateFromPool(1);
            else temp += ' ' + rand(0, 999999);
          }
          
          return temp.substr(1);
        
        case 'rstring':
          return rstring.generate({ length:
            req.body.strLength.length > 4096
              ? 4096 : +req.body.strLength || 256
          });
      }
    })();

    await db.getConnection();
 
    const result = await db.query(
      'UPDATE security SET recovery = ? WHERE user_id = ?',
      [recovery, req.session.uid]
    );
    db.release();

    if (!result.affectedRows) throw 'Could not save recovery code';

    res.json({ error: false, recovery });
  }
  catch (err) {
    db.release();
    res.json({ error: true, message: err });
  }

}