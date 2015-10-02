var bcrypt = require('bcrypt');
var db = require('../../lib/db'); 

module.exports = {
	
	// Take email/pass and return security measures or login user
	login: function(req, res) {
		
		// Check for required fields
		if (!req.body.email || !req.body.password) {
			res.json({error: true, message: "Required field(s) empty"});
			return;
		}
		
		db(function(connection) {
			connection.query('SELECT id, password FROM users WHERE email = ?', [req.body.email], function(err, rows) {
				
				// Check if user exists
				if (rows.length == 0) {
					res.json({error: true, message: "Could not find a user with that email / password"});
					return;
				}
				
				// Verify password
				bcrypt.compare(req.body.password, rows[0].password, function(err, match) {
					
					// Password is incorrect
					if (!match) {
						res.json({error: true, message: "Could not find a user with that email / password"});
						return;
					}
					
					var uid = rows[0].id;
					
					// Check for extra security required
					connection.query('SELECT * FROM security WHERE user_id = ?', [uid], function(err, rows) {
						
						var doLogin = true;
						 
						 // Deal with extra security measures
						if (rows[0].phone || rows[0].addresses || rows[0].codes) {
							
							var response = {
								security: {
									phone: false,
									code: false,
									codeNumber: 0
								},
								error: false,
								uid: uid,
								auth: ""
							};
							
							// Check if user's IP address is allowed
							if (rows[0].addresses) {
								if (rows[0].addresses.split(',').indexOf(req.ip) == -1) {
									res.json({error: true, message: "IP address is not whitelisted"});
									return;
								}
							}
							
							// Send code to user's phone
							if (rows[0].phone) {
								require('../../lib/sms/sendCode')(uid, rows[0].phone);
								response.security.phone = true;
								doLogin = false;
							}
							
							// Randomly choose a code from list
							if (rows[0].codes) {
								var code = Math.floor(Math.random() * rows[0].codes.split(',').length);
								
								response.security.code = true;
								response.security.codeNumber = code;
								doLogin = false;
								
								// Save code to db
								connection.query('UPDATE security SET code = ? WHERE user_id = ?', [code, uid], function(err, result) {return;});
							}
							
							// If extra user input is required, don't login yet
							// Send extra security information back to client
							if (!doLogin) {
								require('../../lib/auth/generateToken')([uid], function(token) {
									response.auth = token;
									res.json(response);
								});
							}
						}
						
						connection.release();
						
						// Complete login
						if (doLogin) {
							require('../../lib/login/doLogin')(req, uid);
							res.json({error: false, loggedIn: true, redirect: req.session.redirect ? req.session.redirect : '' });
						}
					});
				});
			});
		});
	},
	
	// Verify security measures and complete login process
	verify: function(req, res) {
		
		// success() called when succeeded == steps
		var success = function() {
			// Validate auth token
			require('../../lib/auth/validateToken')([req.body.uid], req.body.auth, function(isValid) {
				if (isValid) {
					require('../../lib/login/doLogin')(req, req.body.uid);
					res.json({error: false, loggedIn: true, redirect: req.session.redirect ? req.session.redirect : '' });
				}
				else {
					res.json({error: true, message: "Invalid or expired authentication token."});
				}
			});
		},
			steps = 0,
			succeeded = 0;
		
		// Verify sms code
		if (req.body.smsCode != 0) {
			steps++;
			
			require('../../lib/sms/verifyCode')(req.body.uid, req.body.smsCode, function(isValid) {
				if (!isValid)
					res.json({error: true, message: "Invalid SMS code"});
				else if (++succeeded == steps)
					success();
			});
		}
		
		// Verify code
		if (req.body.code != 0) {
			steps++;
			
			db(function(connection) {
				connection.query('SELECT codes, code FROM security WHERE user_id = ?', [req.body.uid], function(err, rows) {
					connection.release();
					
					if (rows[0].codes.split(',').indexOf(req.body.code) != rows[0].code)
						res.json({error: true, message: "Invalid code"});
					else if (++succeeded == steps)
						success();
				});
			});
		}
	},
	
	// Create session for linked service
	loginService: function(req, res) {

	},
	
	// Generate and send passwordless login link
	passwordless: function(req, res) {
		db(function(connection) {
			connection.query('SELECT id FROM users WHERE email = ?', [req.params.email], function(err, rows) {
				if (rows.length == 0) {
					connection.release();
					res.json({error: true, message: "An error occured."});
					return;
				}
				
				var uid = rows[0].id;
				
				connection.query('SELECT phone, passwordless FROM security WHERE user_id = ?', [uid], function(err, rows) {
					connection.release();
					
					if (rows[0].passwordless == 0) {
						res.json({error: true, message: "Passwordless login not enabled."});
						return;
					}
					
					require('../../lib/auth/generateToken')([uid], function(token) {
						var link = 'https://accounts.xyfir.com/login/passwordless/' + uid + '/' + token;
						
						// Send via sms
						if (rows[0].passwordless == 1 || rows[0].passwordless == 3)
							require('../../lib/sms/sendPasswordless')(rows[0].phone, link);
						// Send via email
						if (rows[0].passwordless == 2 || rows[0].passwordless == 3)
							require('../../lib/email/sendPasswordless')(req.params.email, link);
							
						res.json({error: false, message: "Passwordless login link sent. It will expire in 10 minutes."});
					});
				});
			});
		});
	}
	
};