const initiateSecurityProcess = require('lib/security/initiate');
const sendRecoveryEmail = require('lib/email/send-recovery');
const generateToken = require('lib/tokens/generate');
const mysql = require('lib/mysql');

/*
  POST api/recover
  REQUIRED
    email: string
  RETURN
    {
      error: bool, message?: string, uid?: number,
      auth?: string, security?: object
    }
*/
module.exports = async function(req, res) {

  const db = new mysql();

  try {
    await db.getConnection();

    let rows = await db.query(
      'SELECT id FROM users WHERE email = ? AND verified = ?',
      [req.body.email, 1]
    );

    if (!rows.length) throw 'An unknown error occured';

    const uid = rows[0].id;

    rows = await db.query(
      'SELECT phone, codes FROM security WHERE user_id = ?',
      [uid]
    );
    db.release();

    const security = await initiateSecurityProcess(uid, rows[0]);

    if (security.noSecurity) {
      // User has no extra security measures
      // Send account recovery email
      sendRecoveryEmail(uid, req.body.email);
      res.json({
        error: false,
        message: 'An account recovery link has been sent to your email'
      });
    }
    else if (security.error) {
      res.json(security);
    }
    else {
      // Send security object back to client
      const response = {
        error: false, message: '', email: req.body.email, auth: '',
        uid, security
      };
      
      // Generate auth token
      generateToken({
        user: uid, type: 1
      },
      token => {
        response.auth = token;
        res.json(response);
      });
    }
  }
  catch (err) {
    db.release();
    res.json({ error: true, message: err });
  }

}