const verify = require('lib/sms/verify-code');
const mysql = require('lib/mysql');

/*
  PUT api/dashboard/user/security/phone/verify
  REQUIRED
    code: string, phone: string
  RETURN
    { error: bool, message: string }
*/
module.exports = async function(req, res) {

  const db = new mysql;

  try {
    const isValid = await verify(req.session.uid, req.body.code);

    if (!isValid) throw 'Invalid SMS code';

    await db.getConnection();

    const result = await db.query(
      'UPDATE security SET phone = ?, otp_secret = ? WHERE user_id = ?',
      [req.body.phone, '', req.session.uid]
    );
    db.release();

    if (!result.affectedRows) throw 'Could not save phone';

    res.json({ error: false, message: 'Two factor SMS auth enabled' });
  }
  catch (err) {
    db.release();
    res.json({ error: true, message: err });
  }

}