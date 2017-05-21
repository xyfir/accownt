const securityValidation = require('lib/security/validate');
const sendRecoveryEmail = require('lib/email/send-recovery');

/*
  POST api/recover/verify
  REQUIRED
    email: string, uid: number, auth: string
  OPTIONAL
    code: string, smsCode: string
  RETURN
    { error: bool, message: string }
*/
module.exports = async function(req, res) {
  
  try {
    await securityValidation(req.body);

    // Send account recovery email link
    sendRecoveryEmail(req.body.uid, req.body.email);
    
    res.json({
      error: false,
      message: 'An account recovery link has been sent to your email'
    });
  }
  catch (err) {
    res.json({ error: true, message: err });
  }
  
};