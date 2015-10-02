var config = require('../../config').nodemailer;

module.exports = function(email, subject, message) {
	
	require('nodemailer').createTransport({
		service: config.service,
		auth: config.auth
	}).sendMail({
		from: config.from,
		to: email,
		subject: subject,
		html: message
	},
	function(err, info) {
		return;
	});
	
};