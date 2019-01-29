const mysql = require('lib/mysql');
const rand = require('lib/rand');

/**
 * @typedef {Object} SecurityMeasures
 * @prop {boolean} [otp] - OTP app 2FA enabled.
 */

/**
 * Checks if user has any security measures enabled, validates what it can and
 * inititates others.
 * @async
 * @param {number} uid
 * @param {object} security - Full row from `security` table.
 * @return {undefined|SecurityMeasures}
 */
module.exports = async function(uid, security) {
  // Deal with extra security measures
  if (security.otp_secret) {
    const measures = { otp: false };

    // App OTP 2FA
    if (security.otp_secret) measures.otp = true;

    return measures;
  } else {
    return;
  }
};
