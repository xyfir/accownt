const generateToken = require('lib/tokens/generate');
const sendEmail = require('lib/email/send');

const config = require('config');

/**
 * Sends an account recovery link.
 * @async
 * @param {number} uid
 * @param {string} email
 * @return {object} MailGun response
 */
module.exports = async function(uid, email) {

  const token = await generateToken({ user: uid, type: 1 });

  return await sendEmail({
    to: email,
    from: 'Xyfir Accounts <accounts@xyfir.com>',
    html: `Click <a href="${config.addresses.xacc}api/recover/${uid}/${token}">here</a> to recover access to your account.`,
    subject: 'Account Recovery - Xyfir Accounts'
  });

}