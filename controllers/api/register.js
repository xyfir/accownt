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
			connection.query('SELECT id FROM users WHERE email = ?', [req.body.email], function(err, rows) {
				
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
						password: hash
					};
					
					// Create user's account
					connection.query('INSERT INTO users SET ?', data, function(err, result) {
						res.json({error: false});
						
						// Create row in security table with user's id
						var data = {
							user_id: result.insertId,
						};
						
						connection.query('INSERT INTO security SET ?', data, function() { connection.release(); });
					});
				});
			});
		});
	},
	
	checkEmail: function(req, res) {
		// Check if email is valid / available
		// 0 == email available, 1 == unavailable
		db(function(connection) {
			connection.query('SELECT id FROM users WHERE email = ?', [req.params.email], function(err, rows) {
				connection.release();
				res.send(rows.length + '');
			});
		});
	}
	
};