var db = require('../db.js');

module.exports = function(ids, fn) {
	// Generate random token
	var token = require('crypto').createHash('sha1').update(
			Math.floor(Math.random() * (999999999 - 99999999 + 1) + 99999999
		).toString()).digest('hex');
		
	// Save code to database
	db(function(connection) {
		if (ids.length == 1) {
			// Save to security
			connection.query(
				'UPDATE security SET auth_token = ?, auth_expire = DATE_ADD(NOW(), INTERVAL 10 MINUTE) WHERE user_id = ?',
				[token, ids[0]], function(err, result) {
					connection.release();
					fn(token);
				}
			);
		}
		else {
			// Save to linked_services
			connection.query(
				'UPDATE linked_services SET auth_token = ?, auth_expire = DATE_ADD(NOW(), INTERVAL 5 MINUTE) WHERE '
					+ 'user_id = ? AND service_id = ?',
				[token, ids[0], ids[1]], function(err, result) {
					connection.release();
					fn(token);
				}
			);
		}
	});
};