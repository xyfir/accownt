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
    html: `Click <a href="${config.addresses.xacc}api/login/passwordless/${uid}/${token}">here</a> to login to your account automatically.
    <br /><br/>
    <strong>Warning!</strong> Do not click the link if you did not request this email as it might login whoever requested it to your account!`,
    subject: 'Passwordless Login - Xyfir Accounts'
  });

}