var bcrypt = require('bcrypt');
var db = require('../../../lib/db.js');

module.exports = {
	
	info: function(req, res) {
		db(function(connection) {
			connection.query('SELECT email FROM users WHERE id = ?', [req.session.uid], function(err, rows) {
				connection.release();
				res.json({email: rows[0].email});
			});
		});
	},
	
	update: function(req, res) {
		db(function(connection) {
			connection.query('SELECT password FROM users WHERE id = ?', [req.session.uid], function(err, rows) {
				// Check if current password matches
				bcrypt.compare(req.body.currentPassword, function(err, match) {
					if (match) {
						bcrypt.hash(req.body.newPassword, 10, function(err, hash) {
							// Update password
							connection.query('UPDATE users SET password = ? WHERE id = ?', [hash, req.session.uid]);
							res.json({error: false, message: "Password successfully updated"});
						});
					}
					else {
						res.json({error: true, message: "Incorrect password"});
					}
					
					connection.release();
				});
			});
		});
	}
};