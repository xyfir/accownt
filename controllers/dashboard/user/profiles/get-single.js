const mysql = require('lib/mysql');

/*
  GET api/dashboard/user/profiles/:profile
  RETURN
    { error: bool, message?: string, profile?: { ** } }
*/
module.exports = async function(req, res) {

  const db = new mysql;

  try {
    await db.getConnection();
    const [profile] = await db.query(`
      SELECT * FROM profiles WHERE id = ? AND user_id = ?
    `, [
      req.params.profile, req.session.uid
    ]);
    db.release();

    if (!profile) throw 'Profile does not exist';

    if (profile.birthdate == '0000-00-00') profile.birthdate = '';

    res.json({ error: false, profile });
  }
  catch (err) {
    db.release();
    res.json({ error: true, message: err });
  }

}