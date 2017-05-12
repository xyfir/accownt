const generateToken = require('lib/tokens/generate');
const sendEmail = require('lib/email/send');

/**
 * Sends a verification email to the user's email address.
 * @async
 * @param {number} user
 * @param {string} email
 */
module.exports = async function(user, email) { 
  
  const token = await generateToken({ user, type: 1 });
  const link =
    `https://accounts.xyfir.com/api/login/verify-email/${user}/${token}`;

  sendEmail(
    email,
    'Email Verification - Xyfir Accounts',
    'Please complete your registration by verifying your email:'
      + '<br /><br/>'
      + `<a href='${link}'>${link}</a>`
  );

}