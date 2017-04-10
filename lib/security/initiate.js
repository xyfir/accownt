const sendCode = require('lib/sms/send-code');
const mysql = require('lib/mysql');

// Takes object containing values from security table for a user
// Checks if user has any security measures enabled
// Validates those it can and initiates others
// When finished calls a callback containing results
module.exports = async function(uid, security) {
  
  // Deal with extra security measures
  if (
    security.phone != '' || security.phone != 0 ||
    security.addresses != '' || security.codes != ''
  ) {
    const response = { phone: false, code: false };
    
    // Send code to user's phone
    if (security.phone) {
      sendCode(uid, security.phone);
      response.phone = true;
    }
    
    // Randomly choose a code from list
    if (security.codes) {
      const code = Math.floor(
        Math.random() * security.codes.split(',').length
      );
      
      response.code = true;
      response.codeNumber = code;

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
    
    return response;
  }
  else {
    return { noSecurity: true };
  }
  
};