const rstring = require("randomstring");
const db = require("lib/db");

module.exports = function(data, fn) {
	// Generate random token
	const token = data.type + rstring.generate(63);
		
	// Save code to database
	db(cn => {
		let sql = "", vars = [];

		// Generate authentication token
		if (data.type == 1) {
			// Generate for security table
			if (!data.service) {
				// Save to security
				sql = `
					UPDATE security SET
						auth_token = ?, auth_expire = DATE_ADD(NOW(), INTERVAL 10 MINUTE)
					WHERE user_id = ?
				`, vars = [
					token, data.user
				];

				cn.query(sql, vars, (err, result) => {
					cn.release();
					fn(token);
				});
			}
			// Generate for linked_services table
			else {
				// Save to linked_services
				sql = `
					UPDATE linked_services SET
						auth_token = ?, auth_expire = DATE_ADD(NOW(), INTERVAL 10 MINUTE)
					WHERE user_id = ? AND service_id = ?
				`, vars = [
					token, data.user, data.service
				];

				cn.query(sql, vars, (err, result) => {
					// Get XID
					sql = `
						SELECT xyfir_id FROM linked_services WHERE user_id = ? AND service_id = ?
					`, vars = [
						data.user, data.service
					];

					cn.query(sql, vars, (err, rows) => {
						cn.release();
						fn(token, rows[0].xyfir_id);
					});
				});
			}
		}
		// Generate access token
		else if (data.type == 2) {
			sql = `
				INSERT INTO access_tokens
					(user_id, service_id, token, created, expires, last_use)
				VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 3 DAY), NOW())
			`, vars = [
				data.user, data.service, token
			];

			cn.query(sql, vars, (err, result) => {
				cn.release();
				fn(token);
			});
		}
	});
};