const db = require("../../lib/db");

/*
	GET api/service/:service
	RETURNED
		{ error: bool, message: string, service?: {}, profiles?: [] }
	DESCRIPTION
		Returns to user when linking service to account
*/
module.exports = function(req, res) {
	
    db(cn => {
		cn.query("SELECT name, description, info FROM services WHERE id = ?", [req.params.service], (err, rows) => {
			
			if (err || rows.length == 0) {
				cn.release();
				res.json({error: true, message: "Service does not exist."});
				return;
			}
			
			const data = {
				name: rows[0].name,
				description: rows[0].description,
				requested: JSON.parse(rows[0].info)
			};
			
			// Check if user is already linked to service
			cn.query("SELECT xyfir_id FROM linked_services WHERE user_id = ? AND service_id = ?",
			[req.session.uid, req.params.service], (err, rows) => {
				if (rows.length > 0) {
					cn.release();
					res.json({ error: true, message: "Service is already linked to account." });
					return;
				}
				
				// Grab user"s profiles
				cn.query("SELECT profile_id, name FROM profiles WHERE user_id = ?", [req.session.uid], (err, rows) => {
					cn.release();
					
					// profiles: [{name,profile_id},{...}]
					res.json({ error: false, message: "", service: data, profiles: rows });
				});
			})
		});
	});

}