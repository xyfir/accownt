const generateToken = require('lib/tokens/generate');
const sendEmail = require('./send');

module.exports = function(uid, email) {
  
  generateToken({
    user: uid, type: 1
  },
  token => {
    sendEmail(
      email,
      'Xyfir Accounts - Account Recovery',
      `https://accounts.xyfir.com/api/recover/${uid}/${token}`
    );
  });

}