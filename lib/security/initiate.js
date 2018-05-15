const mysql = require('lib/mysql');
const rand = require('lib/rand');

/**
 * @typedef {Object} SecurityMeasures
 * @prop {boolean} [code] - Security codes 2FA enabled.
 * @prop {boolean} [otp] - OTP app 2FA enabled.
 */

/**
 * Checks if user has any security measures enabled, validates what it can and
 * inititates others.
 * @async
 * @param {number} uid
 * @param {object} security - Full row from `security` table.
 * @return {undefined|SecurityMeasures}
 */
module.exports = async function(uid, security) {
  // Deal with extra security measures
  if (security.codes || security.otp_secret) {
    const measures = { code: false, otp: false };

    // Randomly choose a code from list
    if (security.codes) {
      const code = rand(0, security.codes.split(',').length - 1);

      measures.code = true;
      measures.codeNumber = code;

      const db = new mysql();

      try {
        await db.getConnection();
        await db.query('UPDATE security SET code = ? WHERE user_id = ?', [
          code,
          uid
        ]);
        db.release();
      } catch (err) {
        db.release();
        return;
      }
    }

    // App OTP 2FA
    if (security.otp_secret) measures.otp = true;

    return measures;
  } else {
    return;
  }
};
