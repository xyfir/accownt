const securityValidation = require('lib/security/validate');
const sendRecoveryEmail = require('lib/email/send-recovery');

/*
  POST api/recover/verify
  REQUIRED
    email: string, uid: number
  RETURN
    {
      error: bool, message?: string, uid?: number,
      auth?: string, security?: { ** }
    }
*/
module.exports = function(req, res) {
  
  securityValidation(req.body, response => {
    if (response.error) {
      res.json(response);
    }
    else {
      // Send account recovery email link
      sendRecoveryEmail(req.body.uid, req.body.email);
      
      res.json({
        error: false,
        message: 'An account recovery link has been sent to your email'
      });
    }
  });
  
};