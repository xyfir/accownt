const db = require("../../lib/db");
	
/*
	GET api/service/:service/:xid/:token
	RETURNED
		{ error: true } || { xadid?: string[, fname,country,...] }
	DESCRIPTION
		Called by service upon successful login
		Returns xadid and info required/optional data provided by user
*/
module.exports = function(req, res) {
	
    db(cn => {
		// Check if xid+serviceid matches
		cn.query(
			"SELECT user_id, info FROM linked_services WHERE service_id = ? AND xyfir_id = ?",
			[req.params.service, req.params.xid], (err, rows) => {

				if (err || rows.length == 0) {
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
						// Grab requested info from service
						cn.query("SELECT info FROM services WHERE id = ?", [req.params.service], (err, rows) => {
							let requested = JSON.parse(rows[0].info);
							
							// Grab data from profile
							cn.query("SELECT * FROM profiles WHERE profile_id = ?", [data.profile], (err, rows) => {
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
			}
		);
	});

}