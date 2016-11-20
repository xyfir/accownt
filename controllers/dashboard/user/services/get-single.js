const db = require("lib/db");

/*
    GET api/dashboard/user/services/:service
    RETURN
        {
			error: bool, message?: string, service?: {
				name: string, description: string, address: string, info: {
					requested: {}, provided: {}
				}
			}
		}
	DESCRIPTION
		Return a service's info and user-provided data to the service
*/
module.exports = function(req, res) {

	let sql = `
		SELECT name, description, address, info FROM services WHERE id = ?
	`, vars = [
		req.params.service
	];
	
    db(cn => cn.query(sql, vars, (err, rows) => {
		if (err || rows.length == 0) {
			res.json({ error: true });
			return;
		}
		
		let data = {
			name: rows[0].name,
			address: rows[0].address,
			description: rows[0].description,
			info: {
				requested: JSON.parse(rows[0].info),
				provided: {}
			}
		};
		
		sql = `
			SELECT info FROM linked_services
			WHERE user_id = ? AND service_id = ?
		`, vars = [
			req.session.uid, req.params.service
		];

		cn.query(sql, vars, (err, rows) => {
			cn.release();
			
			if (err || rows.length == 0) {
				res.json({ error: true });
				return;
			}
			
			data.info.provided = JSON.parse(rows[0].info);
			
			res.json({ error: false, service: data });
		});
	}));

}