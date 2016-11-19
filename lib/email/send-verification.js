const generateToken = require("lib/tokens/generate");
const sendEmail = require("./send");

module.exports = function(uid, email) { 
	
	generateToken({
		user: uid, type: 1
	}, token => {
		const link = "https://accounts.xyfir.com/api/login/verify-email/"
			+ uid + "/" + token;

		sendEmail(
			email,
			"Xyfir Accounts - Email Verification",
			"Please complete your registration by verifying your email: "
				+ `<br /><a href="${link}">${link}</a>`
		);
	});

}