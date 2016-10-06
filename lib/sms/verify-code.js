const db = require("lib/db");

module.exports = function(uid, code, fn) {
	
	let sql = `
		SELECT sms_code FROM security WHERE user_id = ? AND sms_code = ?
	`;

	db(cn => cn.query(sql, [uid, code], (err, rows) => {
		cn.release();
		fn(rows.length == 1);
	}));

};