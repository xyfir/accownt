var db = require('../db.js');

module.exports = function(ids, token, fn) {
	db(function(connection) {
		if (ids.length == 1) {
			connection.query(
				'SELECT auth_token, auth_expire FROM security WHERE user_id = ? AND auth_token = ? AND NOW() < auth_expire',
				[ids[0], token], function(err, rows) {
					connection.release();
					fn(rows.length == 1);
				}
			);
		}
		else {
			connection.query(
				'SELECT auth_token, auth_expire FROM linked_services '
					+ 'WHERE user_id = ? AND service_id = ? AND auth_token = ? AND NOW() < auth_expire',
				[ids[0], ids[1], token], function(err, rows) {
					connection.release();
					fn(rows.length == 1);
				}
			);
		}
	});
};