const generateToken = require("../auth/generateToken");
const sendEmail = require("./send");

export default function(uid, email) {
	
	generateToken([uid], token => {
		sendEmail(
			email,
			"Xyfir Accounts - Email Verification",
			"https://accounts.xyfir.com/api/login/verify-email/" + uid + "/" + token
		);
	});

}