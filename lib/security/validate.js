const validateToken = require("lib/tokens/validate");
const verifySMSCode = require("lib/sms/verify-code")
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

		// Validate user's provided info with info in database
		let sql = "SELECT phone, codes, code FROM security WHERE user_id = ?";
		
		db(cn => cn.query(sql, [security.uid], (err, rows) => {
			cn.release();
			
			if (err || rows.length == 0) {
				fn({error: true, message: "An unknown error occured."});
				return;
			}
			
			// Verify random security code
			if (rows[0].codes != "") {
				const codes = rows[0].codes.toLowerCase().split(",");
				const code = security.code.toLowerCase().trim();

				if (codes[rows[0].code] == code) {
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
		}));
	});

};