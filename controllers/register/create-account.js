const sendVerificationEmail = require('lib/email/send-verification');
const createAccount = require('lib/users/create');
const request = require('superagent');
const config = require('config');
const bcrypt = require('bcrypt');
const MySQL = require('lib/mysql');

/*
  POST /api/register
  REQUIRED
    email: string, recaptcha: string
  OPTIONAL
    password: string
  RETURN
    { error: bool, message?: string, authId?: string, userId?: number }
*/
module.exports = async function(req, res) {
  const db = new MySQL();

  try {
    const { email, recaptcha, password } = req.body;

    if (!email || !recaptcha) throw 'Required field(s) empty';

    // Check if recaptcha response is valid
    const captcha = await request
      .post('https://www.google.com/recaptcha/api/siteverify')
      .type('form')
      .send({
        secret: config.keys.recaptcha,
        response: recaptcha,
        remoteip: req.ip
      });

    if (!captcha.body.success) throw 'Invalid captcha';

    await db.getConnection();

    // Check if the user's email is available
    const [row] = await db.query(
      'SELECT id FROM users WHERE email = ? AND verified = ?',
      [email, 1]
    );
    if (row) throw 'Email is already linked to an account';

    const uid = await createAccount(db, {
      email,
      password: password ? await bcrypt.hash(password, 10) : ''
    });
    db.release();

    // Send email verification email
    // !! Requires row in security table
    const authId = await sendVerificationEmail(uid, email);

    res.status(200).json({ authId, userId: uid });
  } catch (err) {
    db.release();
    res.status(400).json({ message: err });
  }
};
