const sendCode = require('lib/sms/send-code');
const mysql = require('lib/mysql');
const rand = require('lib/rand');

/**
 * @typedef {Object} SecurityMeasures
 * @property {boolean} [phone] - SMS 2FA enabled.
 * @property {boolean} [code] - Security codes 2FA enabled.
 * @property {boolean} [otp] - OTP app 2FA enabled.
 */

/**
 * Checks if user has any security measures enabled, validates what it can and 
 * inititates others.
 * @async
 * @param {number} uid
 * @param {object} security - Full row from `security` table.
 * @returns {undefined|SecurityMeasures}
 */
module.exports = async function(uid, security) {
  
  // Deal with extra security measures
  if (security.phone || security.codes || security.otp_secret) {
    const measures = { phone: false, code: false, otp: false };
    
    // Send code to user's phone
    if (security.phone) {
      sendCode(uid, security.phone);
      measures.phone = true;
    }
    
    // Randomly choose a code from list
    if (security.codes) {
      const code = rand(0, security.codes.split(',').length - 1);
      
      measures.code = true;
      measures.codeNumber = code;

      const db = new mysql();
      
      try {
        await db.getConnection();
        await db.query(
          'UPDATE security SET code = ? WHERE user_id = ?',
          [code, uid]
        );
        db.release();
      }
      catch (err) {
        db.release();
        return;
      }
    }

    // App OTP 2FA
    if (security.otp_secret) measures.otp = true;
    
    return measures;
  }
  else {
    return;
  }
  
};