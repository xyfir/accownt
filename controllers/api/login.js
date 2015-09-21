var bcrypt = require('bcrypt');
var db = require('../../lib/db'); 

module.exports = {
	
	// Take email/pass and return security measures or login user
	login: function(req, res) {
		
		// Check for required fields
		if (!req.body.email || !req.body.password) {
			res.status(400).json({error: true, message: "Required field(s) empty"});
			return;
		}
		
		db(function(connection) {
			connection.query('SELECT id, password FROM users WHERE email = ?', [req.body.email], function(err, rows) {
				
				// Check if user exists
				if (rows.length == 0) {
					res.status(404).json({error: true, message: "Could not find a user with that email / password"});
					return;
				}
				
				// Verify password
				bcrypt.compare(req.body.password, rows[0].password, function(err, res) {
					
					// Password is incorrect
					if (!res) {
						res.status(404).json({error: true, message: "Could not find a user with that email / password"});
						return;
					}
					
					var uid = rows[0].id;
					
					// Check for extra security required
					connection.query('SELECT * FROM security WHERE user_id = ?', [uid], function(err, rows) {
						
						// No longer needed
						connection.release();
						 
						 // Deal with extra security measures
						if (rows[0].phone || rows[0].addresses || rows[0].codes) {
							
							var response = {
								security: {
									phone: false,
									code: false,
									codeNumber: 0
								},
								error: false,
								user: uid
							};
							
							var doLogin = true;
							
							// Check if user's IP address is allowed
							if (rows[0].addresses) {
								if (rows[0].addresses.split(',').indexOf(req.ip) == -1) {
									res.status(401).json({error: true, message: "IP address is not whitelisted"});
								}
							}
							
							// Send code to user's phone
							if (rows[0].phone) {
								require('../../lib/sms/sendCode')(rows[0].phone);
								response.security.phone = true;
								doLogin = false;
							}
							
							// Randomly choose a code from list
							if (rows[0].codes) {
								var code = Math.random() * rows[0].codes.split(',').length;
								
								response.security.code = true;
								response.security.codeNumber = code;
								doLogin = false;
							}
							
							// If extra user input is required, don't login yet
							// Send extra security information back to client
							if (!doLogin) {
								res.json(response);
							}
						}
						
						// Complete login
						require('../../lib/login/doLogin')(req, uid);
						res.json({error: false, loggedIn: true});
					});
				});
			});
		});
	},
	
	// Verify security measures and complete login process
	verify: function(req, res) {
		
		// success() called when succeeded == steps
		var success = function() {
			require('../../lib/login/doLogin')(req, req.body.uid);
			res.json({error: false, loggedIn: true});
		},
			steps = 0,
			succeeded = 0;
		
		// Verify sms code
		if (req.body.smsCode) {
			steps++;
			
			if (!require('../../lib/sms/verifyCode').byUser(req.body.uid, req.body.smsCode)) {
				res.status(401).json({error: true, message: "Invalid SMS code"});
				return;
			}
			
			if (++succeeded == steps) success();
		}
		
		// Verify code
		if (req.body.code && req.body.codeNum) {
			steps++;
			
			db(function(connection) {
				connection.query('SELECT codes FROM security WHERE user_id = ?', [req.body.uid], function(err, rows) {
					if (rows[0].codes.split(',')[req.body.codeNum - 1] != req.body.code) {
						res.status(401).json({error: true, message: "Invalid code"});
						return;
					}
				});
			});
			
			if (++succeeded == steps) success();
		}
	},
	
	// Create session for linked service
	loginService: function(req, res) {

	}
	
};