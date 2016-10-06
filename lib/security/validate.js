const validateToken = require("lib/tokens/validate");
const verifySMSCode = require("lib/sms/verifyCode")
const db = require("lib/db")

module.exports = function(security, fn) {
	
	// Validate auth token
	validateToken({
		user: security.uid, token: security.auth
	}, (isValid) => {
		if (!isValid) {
			fn({
				error: true,
				message: "Invalid or expired authentication token."
			}); return;
		}
		
		// Validate user"s provided info with info in database
		db(cn => {
			cn.query("SELECT phone, codes, code FROM security WHERE user_id = ?", [security.uid], (err, rows) => {
				
				cn.release();
				
				if (err || rows.length == 0) {
					fn({error: true, message: "An unknown error occured."});
					return;
				}
				
				// Verify random code
				if (rows[0].codes != "") {
					if (rows[0].codes.split(",").indexOf(security.code) != rows[0].code) {
						fn({error: true, message: "Invalid random security code."});
						return;
					}
				}
				
				// Verify sms code
				if (rows[0].phone != 0 && rows[0].phone != "") {
					verifySMSCode(security.uid, security.smsCode, (isValid) => {
						if (!isValid)
							fn({error: true, message: "Invalid sms code."});
						else
							fn({error: false});
					});
				}
				
			});
		});
	});

};