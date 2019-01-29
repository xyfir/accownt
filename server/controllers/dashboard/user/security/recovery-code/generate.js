const MySQL = require('lib/mysql');
const rword = require('rword');
const rand = require('lib/rand');

/*
  PUT /api/dashboard/user/security/recovery-code
  RETURN
    { message?: string, recovery?: string }
*/
module.exports = async function(req, res) {
  const db = new MySQL();
  try {
    const recovery = (() => {
      const count = 12;
      let temp = '';

      for (let i = 0; i < count; i++) {
        if (rand(0, 1) == 0) temp += ' ' + rword.generateFromPool(1);
        else temp += ' ' + rand(100, 9999);
      }

      return temp.substr(1);
    })();

    const result = await db.query(
      'UPDATE security SET recovery = ? WHERE user_id = ?',
      [recovery, req.session.uid]
    );
    if (!result.affectedRows) throw 'Could not save recovery code';

    res.status(200).json({ recovery });
  } catch (err) {
    res.status(400).json({ message: err });
  }
  db.release();
};
