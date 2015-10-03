module.exports = function(security, fn) {
	
	// Validate auth token
	require('../auth/validateToken')([security.uid], security.auth, function(isValid) {
		if (!isValid) {
			fn({error: true, message: "Invalid or expired authentication token."});
			return;
		}
		
		// Validate user's provided info with info in database
		require('../db')(function(connection) {
			connection.query('SELECT phone, codes, code FROM security WHERE user_id = ?', [security.uid], function(err, rows) {
				
				connection.release();
				
				if (err || rows.length == 0) {
					fn({error: true, message: "An unknown error occured."});
					return;
				}
				
				// Verify random code
				if (rows[0].codes != "") {
					if (rows[0].codes.split(',').indexOf(security.code) != rows[0].code) {
						fn({error: true, message: "Invalid random security code."});
						return;
					}
				}
				
				// Verify sms code
				if (rows[0].phone != 0 && rows[0].phone != "") {
					require('../sms/verifyCode')(security.uid, security.smsCode, function(isValid) {
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