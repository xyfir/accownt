const sendEmail = require('lib/email/send');
const config = require('config');

/**
 * Sends a passwordless login link and authorization code.
 * @async
 * @param {string} email
 * @param {number} uid
 * @param {string} token
 * @return {object} MailGun response
 */
module.exports = async function(email, uid, token) {

  return await sendEmail({
    to: email,
    from: 'Xyfir Accounts <accounts@xyfir.com>',
    html: `Click <a href="${config.addresses.xacc}api/login/passwordless/${uid}/${token}">here</a> to login automatically, or enter in the following authorization code: <code>${uid}_${token}</code>.`,
    subject: 'Passwordless Login - Xyfir Accounts'
  });

}