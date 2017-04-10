const initiateSecurityProcess = require('lib/security/initiate');
const sendVerificationEmail = require('lib/email/send-verification');
const generateToken = require('lib/tokens/generate');
const bcrypt = require('bcrypt');
const mysql = require('lib/mysql');

/*
  POST api/login
  REQUIRED
    email: string, password: string
  RETURN
    {
      error: bool, message?: string, loggedIn?: bool,
      redirect?: string, uid?: number, auth?: string,
      security?: { ** }, loginAttempts?: number
    }
*/
module.exports = async function(req, res) {

  const { email, password } = req.body;
  const db = new mysql();

  try {
    // Check for required fields
    if (!email || !password) {
      throw 'Required field(s) empty';
    }

    await db.getConnection();

    let sql = `
      SELECT
        id, email, password, verified, login_attempts,
        DATE_ADD(
          last_login_attempt, INTERVAL 15 MINUTE
        ) < NOW() as reset_attempts
      FROM users WHERE email = ?
    `;

    let rows = await db.query(sql, [email]);

    // Check if user exists
    if (rows.length == 0) {
      throw 'Could not find a user with that email / password';
    }

    // Verify password
    bcrypt.compare(password, rows[0].password, async (err, match) => {
      // Password is incorrect
      // or login was correct but user hit login attempts limit
      if (!match || (rows[0].login_attempts >= 5 && !rows[0].reset_attempts)) {
        // Increment login_attempts, update last_login_attempt
        sql = `
          UPDATE users SET
            login_attempts = login_attempts + 1,
            last_login_attempt = NOW()
          WHERE id = ?
        `;
        await db.query(sql, [rows[0].id]);

        res.json({
          error: true,
          message: 'Could not find a user with that email / password',
          loginAttempts: rows[0].login_attempts + 1
        }); return;
      }

      // Clear login attempts
      sql = `
        UPDATE users SET login_attempts = 0 WHERE id = ?
      `;
      await db.query(sql, [rows[0].id]);
      
      const uid = rows[0].id;
      
      // Check if account's email is verified
      if (rows[0].verified == 0) {
        sendVerificationEmail(uid, email);
        
        throw 'You cannot login until you have verified your email. '
          + 'A new verification link has been sent to your email.';
      }

      // Check for extra security required
      sql = `
        SELECT * FROM security WHERE user_id = ?
      `;
      rows = await db.query(sql, [uid]);
      db.release();

      const security = await initiateSecurityProcess(uid, rows[0]);

      if (security.noSecurity) {
        // User has no extra security measures; do login
        req.session.uid = uid;
        res.json({
          error: false, loggedIn: true, redirect: (
            req.session.redirect ? req.session.redirect : ''
          )
        });
        req.session.redirect = '';
      }
      else if (security.error) {
        res.json(security);
      }
      else {
        // Send security object back to client
        const response = {
          error: false, auth: '', security, uid
        };
        
        // Generate auth token
        generateToken({
          user: uid, type: 1
        },
        token => {
          response.auth = token;
          res.json(response);
        });
      }
    });
  }
  catch (err) {
    db.release();
    res.json({ error: true, message: err });
  }

}