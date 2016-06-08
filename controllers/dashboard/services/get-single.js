const db = require("../../../lib/db");

/*
    GET api/dashboard/services/:service
    RETURN
        {
			error: bool, message?: string,
			service?: { name: string, description: string, info }
		}
*/
module.exports = function(req, res) {
	
    db(cn => {
		connection.query("SELECT name, description, info FROM services WHERE id = ?", [req.params.service], (err, rows) => {
			if (err || rows.length == 0) {
				res.json({error: true});
				return;
			}
			
			let data = {
				name: rows[0].name,
				description: rows[0].description,
				info: {
					requested: JSON.parse(rows[0].info)
				}
			};
			
			connection.query(
				"SELECT info FROM linked_services WHERE user_id = ? AND service_id = ?",
				[req.session.uid, req.params.service],
				(err, rows) => {
					connection.release();
					
					if (err || rows.length == 0) {
						res.json({error: true});
						return;
					}
					
					data.info.provided = JSON.parse(rows[0].info);
					
					res.json({error: false, message: "", service: data});
				}
			);
		});
	});

}