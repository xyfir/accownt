const initiateSecurityProcess = require('lib/security/initiate');
const sendRecoveryEmail = require('lib/email/send-recovery');
const generateToken = require('lib/tokens/generate');
const MySQL = require('lib/mysql');

/*
  POST /api/recover
  REQUIRED
    email: string
  RETURN
    {
      message?: string, uid?: number, auth?: string,
      security?: {
        noSecurity?: bool, otp?: bool
      }
    }
*/
module.exports = async function(req, res) {
  const db = new MySQL();

  try {
    await db.getConnection();

    let rows = await db.query(
      'SELECT id FROM users WHERE email = ? AND verified = ?',
      [req.body.email, 1]
    );

    if (!rows.length) throw 'An unknown error occured';

    const uid = rows[0].id;

    rows = await db.query('SELECT otp_secret FROM security WHERE user_id = ?', [
      uid
    ]);
    db.release();

    const security = await initiateSecurityProcess(uid, rows[0]);

    if (!security) {
      // User has no extra security measures
      // Send account recovery email
      sendRecoveryEmail(uid, req.body.email);
      res.status(200).json({
        message: 'An account recovery link has been sent to your email'
      });
    } else {
      // Generate auth token
      const { token } = await generateToken({
        user: uid,
        type: 1
      });

      // Send security object back to client
      res.status(200).json({
        email: req.body.email,
        auth: token,
        uid,
        security
      });
    }
  } catch (err) {
    db.release();
    res.status(400).json({ message: err });
  }
};
