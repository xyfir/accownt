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
			connection.query('SELECT id, password, verified FROM users WHERE email = ?', [req.body.email], function(err, rows) {
				
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
					
					// Check if account's email is verified
					if (rows[0].verified == 0) {
						require('../../lib/email/sendVerification')(uid, req.body.email);
						res.json({
							error: true,
							message: "You cannot login until you've verified your email. A new verification link has been sent to your email."
						});
						return;
					}
					
					// Check for extra security required
					connection.query('SELECT * FROM security WHERE user_id = ?', [uid], function(err, rows) {
						
						connection.release();
						
						require('../../lib/security/initiate')(uid, req, rows[0], function(security) {
							if (security.noSecurity) {
								// User has no extra security measures
								// Login user
								require('../../lib/login/doLogin')(req, uid);
								res.json({error: false, loggedIn: true, redirect: req.session.redirect ? req.session.redirect : '' });
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
		});
	},
	
	// Verify security measures and complete login process
	verify: function(req, res) {
		
		require('../../lib/security/validate')(req.body, function(response) {
			if (response.error) {
				res.json(response); // {error,message}
			}
			else {
				// Complete login process
				require('../../lib/login/doLogin')(req, req.body.uid);
				res.json({error: false, loggedIn: true, redirect: req.session.redirect ? req.session.redirect : '' });
			}
		});
		
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