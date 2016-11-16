const db = require("lib/db");

const config = require("config");

/*
	GET api/service/:service
	RETURNED
		{ error: bool, message?: string, service?: {}, profiles?: [] }
	DESCRIPTION
		Returns to user when linking service to account
*/
module.exports = function(req, res) {

	if (!req.session.uid) {
		req.session.redirect = config.addresses.xacc
			+ "app/#/login/" + req.params.service;
		res.json(({ error: true, message: "Not logged in" }));
		return;
	}

	// Get service's info
	let sql = `
		SELECT name, description, info FROM services WHERE id = ?
	`, vars = [
		req.params.service
	];
	
    db(cn => cn.query(sql, vars, (err, rows) => {
		if (err || rows.length == 0) {
			cn.release();
			res.json({ error: true, message: "Service does not exist." });
			return;
		}
		
		const data = {
			name: rows[0].name,
			description: rows[0].description,
			requested: JSON.parse(rows[0].info)
		};

		// Check if user is already linked to service
		sql = `
			SELECT xyfir_id FROM linked_services
			WHERE user_id = ? AND service_id = ?
		`, vars = [
			req.session.uid, req.params.service
		];
		
		cn.query(sql, vars, (err, rows) => {
			if (rows.length > 0) {
				cn.release();
				res.json({
					error: true, message: "Service is already linked to account."
				}); return;
			}

			// Grab user's profiles			
			sql = `
				SELECT profile_id, name FROM profiles WHERE user_id = ?
			`, vars = [
				req.session.uid
			];

			cn.query(sql, vars, (err, rows) => {
				cn.release();
				
				res.json({
					error: false, service: data, profiles: rows
				});
			});
		})
	}));

}