var config = require('../../config').twilio;

// Sends message to phone
module.exports = function(phone, message) {
	require('twilio')(config.sid, config.token).messages.create({
		to: phone,
		from: config.number,
		body: message,
	}, function(err, message) {
		return;
	});
};