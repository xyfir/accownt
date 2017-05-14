const sendVerificationEmail = require('lib/email/send-verification');
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
  let created = false;

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

    // Create user's account
    sql = `
      INSERT INTO users SET ?
    `,
    insert = {
      email: req.body.email,
      password: hash,
      verified: 0
    },
    result = await db.query(sql, insert);

    if (!result.insertId) throw 'Unknown error occured';

    const uid = result.insertId;
    created = true;

    // Generate xads id from xyAds
    const xads = await request
      .post(config.addresses.xads + 'api/xad-id/' + uid)
      .send({ secret: config.keys.xadid });
    
    if (xads.body.error) throw 'Could not generate id from xyAds';

    // Set xad_id in users table
    sql = `
      UPDATE users SET xad_id = ? WHERE id = ?
    `,
    vars = [
      xads.body.xadid, uid
    ];

    await db.query(sql, vars);

    // Create row in security table with user's id
    sql = `
      INSERT INTO security SET ?
    `,
    insert = {
      user_id: uid
    },
    result = await db.query(sql, insert);
      
    // Send email verification email
    // !! Requires row in security table
    sendVerificationEmail(uid, req.body.email);

    db.release();
    res.json({ error: false, message: '' });
  }
  catch (err) {
    // Delete created account
    if (created) {
      await db.query(
        'DELETE FROM users WHERE id = ?', [uid]
      );
    }

    db.release();
    res.json({ error: true, message: err });
  }

}