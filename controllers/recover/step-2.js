const securityValidation = require('lib/security/validate');
const sendRecoveryEmail = require('lib/email/send-recovery');
const mysql = require('lib/mysql');

/*
  POST /api/recover/verify
  REQUIRED
    uid: number, auth: string
  OPTIONAL
    otpCode: string, recovery: string
  RETURN
    { message: string }
*/
module.exports = async function(req, res) {
  const db = new mysql();

  try {
    // User provided recovery code
    if (req.body.recovery) {
      await db.getConnection();
      const rows = await db.query(
        'SELECT user_id FROM security WHERE user_id = ? AND recovery = ?',
        [req.body.uid, req.body.recovery]
      );
      db.release();

      if (!rows.length) throw 'Invalid recovery code';
    } else {
      await securityValidation(req.body);
    }

    // Send account recovery email link
    sendRecoveryEmail(req.body.uid, req.body.email);

    res.status(200).json({
      message: 'An account recovery link has been sent to your email'
    });
  } catch (err) {
    db.release();
    res.status(400).json({ message: err });
  }
};
