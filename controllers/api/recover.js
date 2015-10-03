var db = require('../../lib/db');

module.exports = {
	
	recover: function(req, res) {
		db(function(connection) {
			connection.query('SELECT id FROM users WHERE email = ? AND verified = ?', [req.body.email, 1], function(err, rows) {
				if (rows.length == 0) {
					connection.release();
					res.json({error: true, message: "An unknown error occured."});
					return;
				}
				
				var uid = rows[0].id;
				
				connection.query('SELECT phone, codes, addresses FROM security WHERE user_id = ?', [uid], function(err, rows) {
					connection.release();
					
					require('../../lib/security/initiate')(uid, req, rows[0], function(security) {
						if (security.noSecurity) {
							// User has no extra security measures
							// Send account recovery email
							require('../../lib/email/sendRecovery')(uid, req.body.email)
							res.json({error: false, message: "An account recovery link has been sent to your email."});
						}
						else {
							if (security.error) {
								res.json(security); //{error,message}
							}
							else {
								// Send security object back to client
								var response = {
									security: security,
									error: false,
									message: "",
									email: req.body.email,
									uid: uid,
									auth: ""
								};
								
								// Generate auth token
								require('../../lib/auth/generateToken')([uid], function(token) {
									response.auth = token;
									res.json(response);
								});
							}
						}
					});
				});
			});
		});
	},
	
	verify: function(req, res) {
		require('../../lib/security/validate')(req.body, function(response) {
			if (response.error) {
				res.json(response); // {error,message}
			}
			else {
				// Send account recovery email link
				require('../../lib/email/sendRecovery')(req.body.uid, req.body.email)
				res.json({error: false, message: "An account recovery link has been sent to your email."});
			}
		});
	}
	
};