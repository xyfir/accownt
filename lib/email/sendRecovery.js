const generateToken = require("../auth/generateToken");
const sendEmail = require("./send");

module.exports = function(uid, email) {
	
	generateToken([uid], function(token) {
		sendEmail(
			email,
			"Xyfir Accounts - Account Recovery",
			"https://accounts.xyfir.com/api/recover/" + uid + "/" + token
		);
	});

}