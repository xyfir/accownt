const config = require('config').twilio;
const twilio = require('twilio')(config.sid, config.token);

/**
 * Sends an SMS message via Twilio.
 * @async
 * @param {string} phone
 * @param {string} message
 */
module.exports = async function(phone, message) {
  
  try {
    await twilio
      .api.messages.create({
        to: phone,
        from: config.number,
        body: message,
      })
  }
  catch (err) {
    throw 'Could not send SMS';
  }

};