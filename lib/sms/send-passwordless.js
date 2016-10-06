const send = require("lib/sms/send");

module.exports = function(phone, link) {
	
	send(phone, "Xyfir Accounts - Passwordless Login: " + link);
	
};