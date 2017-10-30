const generateToken = require('lib/tokens/generate');
const sendEmail = require('lib/email/send');
const config = require('config');

/**
 * Sends a verification email to the user's email address.
 * @async
 * @param {number} user
 * @param {string} email
 * @return {string} Auth id
 */
module.exports = async function(user, email) { 
  
  const {id, token} = await generateToken({ user, type: 1 });

  await sendEmail({
    to: email,
    from: 'Xyfir Accounts <accounts@xyfir.com>',
    html: `Click <a href="${config.addresses.xacc}api/login/verify-email/${user}/${token}">here</a> to verify your email and complete your registration.
    <br /><br/>
    You should ignore this message and the link above if you didn't request them.`,
    subject: 'Email Verification - Xyfir Accounts'
  });

  return id;

}