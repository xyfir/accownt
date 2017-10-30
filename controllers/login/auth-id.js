const MySQL = require('lib/mysql');

/*
  POST api/login/auth-id
  REQUIRED
    userId: number, authId: string
  RETURN
    { error: boolean, message?: string, redirect?: string }
  DESCRIPTION
    Check if auth token linked to auth id has been verified
*/
module.exports = async function(req, res) {

  const db = new MySQL;

  try {
    // Validate the user/auth ids and that the token is verified
    // Expire the token immediately
    await db.getConnection();
    const result = await db.query(`
      UPDATE security
      SET auth_expire = NOW()
      WHERE user_id = ? AND auth_id = ? AND auth_verified = 1
    `, [
      req.body.userId, req.body.authId
    ]);
    db.release();

    if (!result.affectedRows) throw 'Could not validate ids/token';

    req.session.uid = +req.body.userId;
    res.json({
      error: false, redirect: req.session.redirect || '/#/dashboard/user'
    });
    req.session.redirect = '';
  }
  catch (err) {
    db.release();
    res.json({ error: true, message: err });
  }

}