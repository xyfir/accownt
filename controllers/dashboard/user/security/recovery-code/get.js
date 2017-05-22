const mysql = require('lib/mysql');

/*
  GET api/dashboard/user/security/recovery-code
  RETURN
    { recovery: string }
*/
module.exports = async function(req, res) {

  const db = new mysql();

  try {
    await db.getConnection();
 
    const rows = await db.query(
      'SELECT recovery FROM security WHERE user_id = ?',
      [req.session.uid]
    );
    db.release();

    res.json(rows[0]);
  }
  catch (err) {
    res.json({ recovery: '' });
  }

}