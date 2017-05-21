const mysql = require('lib/mysql');
const send = require('lib/sms/send');
const rand = require('lib/rand');

/**
 * Send 2FA SMS code.
 * @async
 * @param {number} uid
 * @param {string} phone
 */
module.exports = async function(uid, phone) {
  
  const code = rand(100000, 999999), db = new mysql;

  try {
    await db.getConnection();

    const result = await db.query(
      'UPDATE security SET sms_code = ? WHERE user_id = ?',
      [code, uid]
    );
    db.release();

    send(phone, code + ' - Xyfir Accounts security code');
  }
  catch (err) { db.release(); }

};