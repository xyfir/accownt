const validateToken = require('lib/tokens/validate');
const verifySMS = require('lib/sms/verify-code')
const mysql = require('lib/mysql')

/**
 * Verify user's security measures to allow action. Throws error if anything 
 * is invalid.
 * @async
 * @param {object} security
 * @param {number} security.uid
 * @param {string} security.auth
 * @param {string} [security.code]
 * @param {string} [security.smsCode]
 */
module.exports = async function(security) {

  const db = new mysql;

  try {
    const validToken = await validateToken({
      user: security.uid, token: security.auth
    });

    if (!validToken) throw 'Invalid or expired authentication or access token';

    await db.getConnection();

    const rows = await db.query(
      'SELECT phone, codes, code FROM security WHERE user_id = ?',
      [security.uid]
    )
    db.release();

    if (!rows.length) throw 'Could not find user';

    // Verify random security code
    if (rows[0].codes != '') {
      const codes = rows[0].codes.toLowerCase().split(',');
      const code = security.code.toLowerCase().trim();

      if (codes[rows[0].code] != code) throw 'Invalid random security code';
    }
    
    // Verify sms code
    if (rows[0].phone) {
      const validSMS = await verifySMS(security.uid, security.smsCode);
      
      if (!validSMS) throw 'Invalid sms code';
    }
  }
  catch (err) {
    db.release();
    throw err;
  }

};