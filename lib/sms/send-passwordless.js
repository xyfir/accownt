const send = require("lib/sms/send");

module.exports = function(phone, uid, token) {
	
	const link = "https://accounts.xyfir.com/api/login/passwordless/"
		+ uid + "/" + token;

	send(phone, (
		"Xyfir Accounts - Passwordless Login:\n\n"
		+ "Authorization Code: " + uid + "_" + token
		+ "\n\nLogin Link: " + link
	));
	
};