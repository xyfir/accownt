const generateToken = require('lib/tokens/generate');
const sendEmail = require('lib/email/send');

const config = require('config');

/**
 * Sends an account recovery link.
 * @async
 * @param {number} uid
 * @param {string} email
 */
module.exports = async function(uid, email) {

  const token = await generateToken({ user: uid, type: 1 });

  sendEmail(
    email,
    'Account Recovery - Xyfir Accounts',
    `${config.addresses.xacc}api/recover/${uid}/${token}`
  );

}