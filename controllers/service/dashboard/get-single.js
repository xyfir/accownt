const db = require("../../../lib/db");

/*
	GET api/service/dashboard/:id
	RETURN
		{
			id: number, name: string, description: string, info: json-string,
			owner: number, address: string, xyfir: boolean, keys: string[]
		}
*/
module.exports = function(req, res) {
	
    db(cn => {
		let sql = "SELECT * FROM services WHERE owner = ? AND id = ?";
		cn.query(sql, [req.session.uid, req.params.id], (err, rows) => {
			if (err || !rows.length) {
				cn.release();
				res.json({ id: -1 });
			}
			else {
				let response = rows[0];

				sql = "SELECT service_key FROM service_keys WHERE service_id = ?";
				cn.query(sql, [req.params.id], (err, rows) => {
					cn.release();

					response.keys = rows.map(k => k.service_key);
					
					res.json(response);
				});
			}
		});
	});

}