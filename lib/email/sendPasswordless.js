const sendEmail = require("./send");

export default function(email, link) {
	
	sendEmail(
		email, "Xyfir Accounts - Passwordless Login", link
	);

}