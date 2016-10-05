const rstring = require("randomstring");
const db = require("lib/db");

module.exports = function(ids, fn) {
	// Generate random token
	const token = "1" + rstring.generate(63);
		
	// Save code to database
	db(cn => {
		let sql = "";

		if (ids.length == 1) {
			sql = `
				UPDATE security SET
					auth_token = ?, auth_expire = DATE_ADD(NOW(), INTERVAL 10 MINUTE)
				WHERE user_id = ?
			`;

			// Save to security
			cn.query(sql, [token, ids[0]], (err, result) => {
				cn.release();
				fn(token);
			});
		}
		else {
			sql = `
				UPDATE linked_services SET
					auth_token = ?, auth_expire = DATE_ADD(NOW(), INTERVAL 10 MINUTE)
				WHERE user_id = ? AND service_id = ?
			`;

			// Save to linked_services
			cn.query(sql, [token, ids[0], ids[1]], (err, result) => {
				sql = `
					SELECT xyfir_id FROM linked_services
					WHERE user_id = ? AND service_id = ?
				`;

				// Get xid
				cn.query(sql, [ids[0], ids[1]], (err, rows) => {
					cn.release();
					fn(token, rows[0].xyfir_id);
				});
			});
		}
	});
};