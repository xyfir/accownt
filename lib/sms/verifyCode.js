var db = require('../db');

module.exports = function(uid, code, fn) {
	db(function(connection) {
		connection.query('SELECT sms_code FROM security WHERE user_id = ? AND sms_code = ?', [uid, code], function(err, rows) {
			connection.release();
			
			fn(rows.length == 1);
		});
	});
};