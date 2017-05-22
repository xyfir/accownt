const sendCode = require('lib/sms/send-code');
const mysql = require('lib/mysql');

/*
  PUT api/dashboard/user/security/phone
  OPTIONAL
    phone: string
  RETURN
    { error: bool, message: string }
*/
module.exports = async function(req, res) {

  const db = new mysql;

  try {
    // User is adding or changing phone
    // New phone needs to be verified
    if (req.body.phone) {
      await sendCode(req.session.uid, req.body.phone);
      res.json({ error: false, message: 'Verification code sent' });
    }
    // Remove existing phone from account
    else {
      await db.getConnection();

      const result = await db.query(
        'UPDATE security SET phone = ? WHERE user_id = ?',
        ['', req.session.uid]
      );
      db.release();

      if (!result.affectedRows) throw 'Could not remove phone';

      res.json({ error: false, message: 'SMS 2FA disabled' });
    }
  }
  catch (err) {
    db.release();
    res.json({ error: true, message: err });
  }

}