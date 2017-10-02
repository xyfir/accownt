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
    Enable / verify (non-sms) two factor authentication
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

      req.session.otpTempSecret = speakeasy.generateSecret({
        symbols: true,
        length: 256
      });

      // otpauth url
      let url = speakeasy.otpauthURL({
        algorithm: 'sha512',
        encoding: 'base32',
        secret: req.session.otpTempSecret.base32,
        issuer:'xyAccounts',
        digits: 8,
        label: rows[0].email
      });

      // qr code url
      url = await new Promise((resolve, reject) =>
        qr.toDataURL(url, (e, u) => e ? reject(e) : resolve(u)
      ));
      
      res.json({ error: false, qr: url });
    }
    // User is finishing process and verifying token
    else {
      const verified = speakeasy.totp.verify({
        encoding: 'base32',
        secret: req.session.otpTempSecret.base32,
        token: req.body.token.replace(/\D/g,'')
      });

      if (!verified) throw 'Invalid token';

      // Save otp secret
      const result = await db.query(
        'UPDATE security SET otp_secret = ?, phone = ? WHERE user_id = ?',
        [req.session.otpTempSecret.base32, '', req.session.uid]
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