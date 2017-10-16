const speakeasy = require('speakeasy');
const mysql = require('lib/mysql');
const qr = require('qrcode');

/*
  PUT api/dashboard/user/security/otp
  OPTIONAL
    token: string, remove: boolean
  RETURN
    {
      error: boolean, message?: string,
      qr?: string
    }
  DESCRIPTION
    Enable / verify OTP 2FA
*/
module.exports = async function(req, res) {

  const db = new mysql;

  try {
    await db.getConnection();

    // Remove otp app 2fa from account
    if (req.body.remove) {
      const result = await db.query(
        'UPDATE security SET otp_secret = ? WHERE user_id = ?',
        ['', req.session.uid]
      );
      db.release();

      if (!result.affectedRows) throw 'Could not disable app 2FA';

      res.json({
        error: false,
        message: 'App 2FA disabled. You must manually delete it from your app.'
      });
    }
    // User is starting process of enabling 2fa
    else if (!req.body.token) {
      const rows = await db.query(
        'SELECT email FROM users WHERE id = ?',
        [req.session.uid]
      );

      const {ascii: secret} = speakeasy.generateSecret({
        issuer: 'xyAccounts',
        length: 128,
        name: rows[0].email
      });

      let url = speakeasy.otpauthURL({
        //algorithm: 'sha512',
        issuer: 'xyAccounts',
        digits: 8,
        secret,
        label: encodeURIComponent(rows[0].email)
      });

      // Convert otpauth url to qr code url
      url = await new Promise((resolve, reject) =>
        qr.toDataURL(url, (e, u) => e ? reject(e) : resolve(u)
      ));

      req.session.otpTempSecret = secret;
      
      res.json({ error: false, qr: url });
    }
    // User is finishing process and verifying token
    else {
      const verified = speakeasy.totp.verify({
        //algorithm: 'sha512',
        secret: req.session.otpTempSecret,
        digits: 8,
        token: req.body.token.replace(/\D/g, '')
      });

      if (!verified) throw 'Invalid token';

      // Save otp secret
      const result = await db.query(
        'UPDATE security SET otp_secret = ? WHERE user_id = ?',
        [req.session.otpTempSecret, req.session.uid]
      );
      db.release();

      if (!result.affectedRows) throw 'Could not enable 2FA';

      res.json({ error: false, message: 'App 2FA enabled' });
    }
  }
  catch (err) {
    db.release();
    res.json({ error: true, message: err });
  }

}