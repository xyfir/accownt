const sendCode = require("lib/sms/send-code");
const db = require("lib/db");

// Takes object containing values from security table for a user
// Checks if user has any security measures enabled
// Validates those it can and initiates others
// When finished calls a callback containing results
module.exports = function(uid, req, security, fn) {
	
	// Deal with extra security measures
	if (security.phone != "" || security.phone != 0 || security.addresses != "" || security.codes != "") {
		
		let response = {
			phone: false,
			code: false
		};
		
		// Check if user's IP address is allowed
		if (security.addresses) {
			if (security.addresses.split(',').indexOf(req.ip) == -1) {
				fn({error: true, message: "IP address is not whitelisted"});
				return;
			}
		}
		
		// Send code to user's phone
		if (security.phone) {
			sendCode(uid, security.phone);
			response.phone = true;
		}
		
		// Randomly choose a code from list
		if (security.codes) {
			let code = Math.floor(Math.random() * security.codes.split(',').length);
			
			response.code = true;
			response.codeNumber = code;
			
			// Save code to db
			db(cn => {
				cn.query('UPDATE security SET code = ? WHERE user_id = ?', [code, uid], (err, result) => {
					cn.release();
				});
			});
		}
		
		fn(response); // {phone,code,codeNumber}
	}
	else {
		fn({noSecurity: true});
	}
	
};