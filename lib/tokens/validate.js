const db = require("lib/db");

module.exports = function(data, fn) {
	let sql = "", vars = [];

	db(cn => {
		// Validate authentication token
		if (data.token.substr(0, 1) == 1) {
			// Validate auth token in security table
			if (!data.service) {
				sql = `
					SELECT auth_token FROM security
					WHERE user_id = ? AND auth_token = ? AND NOW() < auth_expire
				`, vars = [
					data.user, data.token
				];
				
				cn.query(sql, vars, (err, rows) => {
					cn.release();
					fn(err || !rows.length ? false : true);
				});
			}
			// Validate auth token in linked_services table
			else {
				sql = `
					SELECT auth_token FROM linked_services
					WHERE
						user_id = ? AND service_id = ? AND auth_token = ?
						AND NOW() < auth_expire
				`, vars = [
					data.user, data.service, data.token
				];
				
				cn.query(sql, vars, (err, rows) => {
					cn.release();
					fn(err || !rows.length ? false : true);
				});
			}
		}
		// Validate access token
		else if (data.token.substr(0, 1) == 2) {
			sql = `
				SELECT token FROM access_tokens
				WHERE
					user_id = ? AND service_id = ? AND token = ?
					AND NOW() < expires
			`, vars = [
				data.user, data.service, data.token
			];

			cn.query(sql, vars, (err, rows) => {
				// Error or invalid token
				if (err || !rows.length) {
					cn.release();
					fn(false);
				}
				// No error, update token's expires and last_use values
				else {
					fn(true);

					sql = `
						UPDATE access_tokens SET
							last_use = NOW(), expires = DATE_ADD(NOW(), INTERVAL 3 DAY)
						WHERE user_id = ? AND service_id = ? AND token = ?
					`, vars = [
						data.user, data.service, data.token
					];

					cn.query(sql, vars, (err, result) => cn.release());
				}
			});
		}
	});
};