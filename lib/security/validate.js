const validateToken = require('lib/tokens/validate');
const speakeasy = require('speakeasy');
const mysql = require('lib/mysql');

/**
 * Verify user's security measures to allow action. Throws error if anything
 * is invalid.
 * @async
 * @param {object} security
 * @param {number} security.uid
 * @param {string} security.auth
 * @param {string} [security.otpCode]
 */
module.exports = async function(security) {
  const db = new mysql();

  try {
    const validToken = await validateToken({
      user: security.uid,
      token: security.auth
    });

    if (!validToken) throw 'Invalid or expired authentication or access token';

    await db.getConnection();

    const rows = await db.query(
      'SELECT otp_secret FROM security WHERE user_id = ?',
      [security.uid]
    );
    db.release();

    if (!rows.length) throw 'Could not find user';

    // Verify app otp code
    if (rows[0].otp_secret) {
      const validOTP = speakeasy.totp.verify({
        //algorithm: 'sha512',
        secret: rows[0].otp_secret,
        digits: 8,
        token: security.otpCode.replace(/\D/g, '')
      });

      if (!validOTP) throw 'Invalid OTP code';
    }
  } catch (err) {
    db.release();
    throw err;
  }
};
