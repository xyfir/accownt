const sendVerificationEmail = require('lib/email/send-verification');
const createAccount = require('lib/users/create');
const request = require('superagent');
const config = require('config');
const bcrypt = require('bcrypt');
const mysql = require('lib/mysql'); 

/*
  POST api/register
  REQUIRED
    email: string, password: string, recaptcha: string
  RETURN
    { error: bool, message: string }
*/
module.exports = async function(req, res) {

  const db = new mysql();

  try {
    if (!req.body.email || !req.body.password || !req.body.recaptcha)
      throw 'Required field(s) empty';
    
    // Check if recaptcha response is valid
    const captcha = await request
      .post('https://www.google.com/recaptcha/api/siteverify')
      .type('form')
      .send({
        secret: config.keys.recaptcha,
        response: req.body.recaptcha,
        remoteip: req.ip
      });
    
    if (!captcha.body.success) throw 'Invalid captcha';

    await db.getConnection();

    // Check if the user's email is available
    let result, insert,
    sql = `
      SELECT id FROM users WHERE email = ? AND verified = ?
    `,
    vars = [
      req.body.email, 1
    ],
    rows = await db.query(sql, vars);

    if (rows.length > 0) throw 'Email is already linked to an account';

    // Create password hash
    const hash = await bcrypt.hash(req.body.password, 10);

    const uid = await createAccount(
      db, { email: req.body.email, password: hash }
    );
    db.release();
      
    // Send email verification email
    // !! Requires row in security table
    sendVerificationEmail(uid, req.body.email);

    res.json({ error: false, message: '' });
  }
  catch (err) {
    db.release();
    res.json({ error: true, message: err });
  }

}