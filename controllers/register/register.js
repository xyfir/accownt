var request = require("request");
var config = require('../../config');
var bcrypt = require('bcrypt');
var db = require('../../lib/db'); 

module.exports = {
	
	createAccount: function(req, res) {
		// Check for required fields
		if (!req.body.email || !req.body.password) {
			res.json({error: true, message: "Required field(s) empty."});
			return;
		}
		
		// Attempt to register user
		db(function(connection) {
			connection.query('SELECT id FROM users WHERE email = ? AND verified = ?', [req.body.email, 1], function(err, rows) {
				
				// Email already linked to account
				if (rows.length > 0) {
					connection.release();
					res.json({error: true, message: "Email is already linked to an account."});
					return;
				}
				
				// Hash password with bcrypt + random salt
				bcrypt.hash(req.body.password, 10, function(err, hash) {
					
					var data = {
						email: req.body.email,
						password: hash,
						verified: 0
					};
					
					// Create user's account
					connection.query('INSERT INTO users SET ?', data, function(err, result) {
						// Generate XADID from Xyfir Ads
						request({
							url: config.xads + "api/xad-id/" + result.insertId,
							form: {
								secret: config.keys.xadid
							}
						}, function(err, response, body) {
							var error = false;
							
							if (err) {
								error = true;
							}
							else {
								body = JSON.parse(body);
								if (body.error) error = true;
							}
							
							// Delete user and respond with error
							if (error) {
								connection.query("DELETE FROM users WHERE id = ?", [result.insertId], function(err, result) {
									connection.release();
									res.json({error: true, message: "Unknown error occured"});
								});
							}
							// Set xadid
							else {
								connection.query(
								"UPDATE users SET xad_id = ? WHERE id = ?",
								[body.xadid, result.insertId],
								function(err, result) {
									// Send email verification email
									require('../../lib/email/sendVerification')(result.insertId, req.body.email);
									
									res.json({error: false, message: ""});
									
									// Create row in security table with user's id
									var data = {
										user_id: result.insertId,
									};
									connection.query('INSERT INTO security SET ?', data, function() { connection.release(); });
								});
							}
						});
					});
				});
			});
		});
	},
	
	checkEmail: function(req, res) {
		// Check if email is valid / available
		// 0 == email available, 1 == unavailable
		db(function(connection) {
			connection.query('SELECT id FROM users WHERE email = ? AND verified = ?', [req.params.email, 1], function(err, rows) {
				connection.release();
				res.send(rows.length + '');
			});
		});
	}
	
};