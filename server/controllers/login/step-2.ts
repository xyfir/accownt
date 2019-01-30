const securityValidation = require('lib/security/validate');
const mysql = require('lib/mysql');

/*
  POST /api/login/verify
  REQUIRED
    uid: number, auth: string
  OPTIONAL
    otpCode: string
  RETURN
    { loggedIn?: bool, redirect?: string }
*/
module.exports = async function(req, res) {
  try {
    await securityValidation(req.body);

    // Complete login process
    req.session.uid = req.body.uid;
    res.status(200).json({
      loggedIn: true,
      redirect: req.session.redirect || ''
    });
    req.session.redirect = '';
  } catch (err) {
    res.status(400).json({ message: err });
  }
};
