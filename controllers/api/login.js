var bcrypt = require('bcrypt');
var db = require('../../lib/db'); 

module.exports = {
	
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
								error: false
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
						require('../../lib/login/doLogin')(uid);
						res.json({error: false, loggedIn: true});
					});
				});
			});
		});
	},
	
	loginService: function(req, res) {

	}
	
};