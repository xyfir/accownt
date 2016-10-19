const sendEmail = require("./send");

module.exports = function(email, uid, token) {
	
	const link = "https://accounts.xyfir.com/api/login/passwordless/"
		+ uid + "/" + token;

	sendEmail(email, "Xyfir Accounts - Passwordless Login", (
		link + "\n\nAuthorization Code:\n" + uid + "_" + token
	));

}