const sendEmail = require('lib/email/send');
const config = require('config');

/**
 * Sends a passwordless login link and authorization code.
 * @param {string} email
 * @param {number} uid
 * @param {string} token
 */
module.exports = function(email, uid, token) {
  
  const link = `${config.addresses.xacc}api/login/passwordless/${uid}/${token}`;

  sendEmail(
    email,
    'Passwordless Login - Xyfir Accounts',
    `${link}<br /><br />Authorization Code: ${uid}_${token}`
  );

}