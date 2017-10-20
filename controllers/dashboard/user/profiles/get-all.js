const mysql = require('lib/mysql');

/*
  GET api/dashboard/user/profiles
  RETURN
    {
      error: boolean, message?: string,
      profiles?: [{
        name: string, id: number
      }]
    }
*/
module.exports = async function(req, res) {

  const db = new mysql;

  try {
    await db.getConnection();
    const profiles = await db.query(`
      SELECT picture, name, id FROM profiles WHERE user_id = ?
    `, [
      req.session.uid
    ]);
    db.release();

    res.json({ error: false, profiles });
  }
  catch (err) {
    db.release();
    res.json({ error: true, message: err });
  }

}