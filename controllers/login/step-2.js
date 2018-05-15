const securityValidation = require('lib/security/validate');
const mysql = require('lib/mysql');

/*
  POST api/login/verify
  REQUIRED
    uid: number, auth: string
  OPTIONAL
    code: string, otpCode: string
  RETURN
    { error: bool, loggedIn?: bool, redirect?: string }
*/
module.exports = async function(req, res) {
  try {
    await securityValidation(req.body);

    // Complete login process
    req.session.uid = req.body.uid;
    res.json({
      error: false,
      loggedIn: true,
      redirect: req.session.redirect || ''
    });
    req.session.redirect = '';
  } catch (err) {
    res.json({ error: true, message: err });
  }
};
