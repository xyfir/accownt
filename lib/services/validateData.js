var db = require('../db');

module.exports = function(req, fn) {
	if (req.body.profile) {
		/* User wants to load data from profile */
		
		// User must allow access to required info
		if (!req.body.profile_allow_required) {
			fn("You cannot link service without allowing access to required info.");
			return;
		}
		
		// Check if profile has data that service requires
		db(function(connection) {
			// Grab data from profile
			connection.query(
				'SELECT * FROM profiles WHERE user_id = ? AND profile_id = ?',
				[req.session.uid, req.body.profile],
				function(err, rows) {
					if (err || rows.length == 0) {
						connection.release();
						fn("An unkown error occured.");
						return;
					}
					
					var profile = rows[0];
					
					// Grab data from service
					connection.query('SELECT info FROM services WHERE id = ?', [req.params.service], function(err, rows) {
						connection.release();
						
						// Loop through auth.required and ensure profile has needed values
						for (var skey in rows[0].info.required) {
							if (!rows[0].info.required.hasOwnProperty(skey))
								continue;
							
							// Make sure profile has values for info's required keys
							if (profile[skey] == "" || profile[skey] == 0 || profile[skey] == "0000-00-00") {
								fn("Profile does not have values for data that service requires.");
								return;
							}
						}
						
						fn("valid");
					});
				}
			);
		});
	}
	else {
		/* User wants to set custom data */
		
		db(function(connection) {
			// Grab requested info from service
			connection.query('SELECT info FROM services WHERE id = ?', [req.params.service], function(err, rows) {
				connection.release();
				
				// Loop through info's required values and make sure user provided values for them
				for (var skey in rows[0].info.required) {
					if (!rows[0].info.required.hasOwnProperty(skey))
						continue;
					
					if (req.body[skey] == "" || req.body[skey] == 0) {
						fn("Required field(s) empty.");
						return;
					}
				}
				
				fn("valid");
			});
		});
	}
}