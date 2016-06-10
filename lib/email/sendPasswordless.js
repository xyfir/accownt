const sendEmail = require("./send");

module.exports = function(email, link) {
	
	sendEmail(
		email, "Xyfir Accounts - Passwordless Login", link
	);

}