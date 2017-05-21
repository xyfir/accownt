const mysql = require('lib/mysql');

/**
 * Verify code that a user provided for SMS 2FA.
 * @async
 * @param {number} uid
 * @param {string} code
 * @returns {boolean} True if code is valid.
 */
module.exports = async function(uid, code) {
  
  const db = new mysql;

  try {
    await db.getConnection();

    const rows = await db.query(
      'SELECT sms_code FROM security WHERE user_id = ? AND sms_code = ?',
      [uid, code]
    );
    db.release();

    return !!rows.length;
  }
  catch (err) {
    db.release();
    return false;
  }

};