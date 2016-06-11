const db = require("../../lib/db");
	
/*
	GET api/service/:service/:key/:xid/:token
	RETURNED
		{ error: true } || { xadid?: string[, fname,country,...] }
	DESCRIPTION
		Called by service upon successful login
		Returns xadid and info required/optional data provided by user
		-
		Check :service / :key
		Check :service / :xid
		Check :xid's uid / :token 
*/
module.exports = function(req, res) {

	let sql = "SELECT id FROM services WHERE id = ? AND service_key = ?";
	let vars = [req.params.service, req.params.key];

    db(cn => cn.query(sql, vars, (err, rows) =>{
		if (err || !rows.length) {
			cn.release();
			res.json({ error: true });
			return;
		}

		// Check if xid+serviceid matches
		sql = "SELECT user_id, info FROM linked_services WHERE service_id = ? AND xyfir_id = ?";
		vars = [req.params.service, req.params.xid];

		cn.query(sql, vars, (err, rows) => {
			if (err || rows.length == 0) {
				cn.release();
				res.json({error: true});
				return;
			}
			
			const uid = rows[0].user_id;
			const getXADID = function(fn) {
				cn.query("SELECT xad_id FROM users WHERE id = ?", [uid], (err, rows) => {
					cn.release();
					fn(rows[0].xad_id);
				});
			};
			
			// Check if auth token is valid
			require("../../lib/auth/validateToken")
			([rows[0].user_id, req.params.service], req.params.token, isValid => {
				if (!isValid) {
					res.json({error: true});
					return;
				}
				
				// Grab info that user provided to service
				let data = JSON.parse(rows[0].info);
				
				if (data.profile) {
					sql = "SELECT info FROM services WHERE id = ?";
					vars = [req.params.service];

					// Grab requested info from service
					cn.query(sql, vars, (err, rows) => {
						let requested = JSON.parse(rows[0].info);
						
						sql = "SELECT * FROM profiles WHERE profile_id = ?";
						vars = [data.profile];
						
						// Grab data from profile
						cn.query(sql, vars, (err, rows) => {
							let provided = {};
							
							// Loop through requested.required and add data
							for (var key in requested.required) {
								if (!requested.required.hasOwnProperty(key))
									continue;
								
								// Copy profile"s data to provided"s data
								// required.name: provided.name = profile.name
								provided[key] = rows[0][key];
							}
							
							// Loop through requested.optional if optional and add data
							if (data.optional) {
								for (var key in requested.optional) {
									if (!requested.optional.hasOwnProperty(key))
										continue;
									
									// Copy profile"s data to provided"s data
									provided[key] = rows[0][key];
								}
							}
							
							getXADID(xadid => {
								provided.xadid = xadid;
								res.json(provided);
							});
						});
					});
				}
				else {
					getXADID(xadid => {
						data.xadid = xadid;
						
						// Return custom data
						res.json(data);
					});
				}
			});
		});
	}));

}