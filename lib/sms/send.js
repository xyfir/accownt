const twilio = require("twilio");

const config = require("../../config").twilio;

module.exports = function(phone, message) {
	
	twilio(config.sid, config.token).messages.create({
		to: phone,
		from: config.number,
		body: message,
	}, (err, message) => 1);

};