const generateToken = require('lib/tokens/generate');
const sendEmail = require('lib/email/send');

const config = require('config');

/**
 * Sends a verification email to the user's email address.
 * @async
 * @param {number} user
 * @param {string} email
 * @return {object} MailGun response
 */
module.exports = async function(user, email) { 
  
  const token = await generateToken({ user, type: 1 });

  return await sendEmail({
    to: email,
    from: 'Xyfir Accounts <accounts@xyfir.com>',
    html: `Click <a href="${config.addresses.xacc}api/login/verify-email/${user}/${token}">here</a> to verify your email and complete your registration.`,
    subject: 'Email Verification - Xyfir Accounts'
  });

}