const MySQL = require('lib/mysql');

/*
  POST /api/login/auth-id
  REQUIRED
    userId: number, authId: string
  RETURN
    { message?: string, redirect?: string }
  DESCRIPTION
    Check if auth token linked to auth id has been verified
*/
module.exports = async function(req, res) {
  const db = new MySQL();

  try {
    const stop = Date.now() + 25 * 1000;

    await db.getConnection();
    while (true) {
      // Validate the user/auth ids and that the token is verified
      // Expire the token immediately
      const result = await db.query(
        `
          UPDATE security
          SET auth_expire = NOW()
          WHERE user_id = ? AND auth_id = ? AND auth_verified = 1
        `,
        [req.body.userId, req.body.authId]
      );

      if (result.affectedRows) break;
      if (Date.now() > stop) throw 'Could not authenticate user';

      await new Promise(r => setTimeout(r, 1000));
    }
    db.release();

    req.session.uid = +req.body.userId;
    res.status(200).json({
      redirect: req.session.redirect || '/user'
    });
    req.session.redirect = '';
  } catch (err) {
    db.release();
    res.status(400).json({ message: err });
  }
};
