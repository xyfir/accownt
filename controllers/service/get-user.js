const validateToken = require("lib/tokens/validate");
const generateToken = require("lib/tokens/generate");
const db = require("lib/db");
	
/*
	GET api/service/:service/:key/:xid/:token
	RETURNED
		{
			error: boolean, message?: string,
			xadid?: string,
			accessToken?: string?
			fname, country, ...
		}
	DESCRIPTION
		Called by service upon successful login OR with access token to start new session
		Returns xadid and info required/optional data provided by user
		:token can be authorization (starts with 1) or access token (starts with 2)
		Generates and returns an access token if :token starts with 1 
*/
module.exports = function(req, res) {

	// Verify service exists and service key is valid
	let sql = `
		SELECT id FROM services WHERE id IN (
			SELECT service_id FROM service_keys
			WHERE service_id = ? AND service_key = ?
		)
	`, vars = [
		req.params.service, req.params.key
	];

    db(cn => cn.query(sql, vars, (err, rows) =>{
		if (err || !rows.length) {
			cn.release();
			res.json({
				error: true, message: "Service id and key do not match"
			}); return;
		}

		// Check if xid matches service
		sql = "SELECT user_id, info FROM linked_services WHERE service_id = ? AND xyfir_id = ?";
		vars = [req.params.service, req.params.xid];

		cn.query(sql, vars, (err, rows) => {
			if (err || !rows.length) {
				cn.release();
				res.json({
					error: true, message: "Xyfir ID not linked to service"
				}); return;
			}
			
			const uid = rows[0].user_id;

			// Get user's Xyfir Ads profile id
			// Generate access token if needed
			// Return info to user
			const finish = function(data) {
				cn.query("SELECT xad_id FROM users WHERE id = ?", [uid], (err, rows) => {
					cn.release();
					
					data.xadid = rows[0].xad_id;
					data.error = false;

					// Generate access token
					if (req.params.token.substr(0, 1) == 1) {
						generateToken({
							user: uid, service: req.params.service, type: 2
						}, token => {
							data.accessToken = token;
							res.json(data);
						});
					}
					// User already has access token
					else {
						res.json(data);
					}
				});
			};
			
			// Check if authentication/access token is valid
			validateToken({
				user: uid, service: req.params.service,
				token: req.params.token
			}, isValid => {
				if (!isValid) {
					res.json({ error: true, message: "Invalid token" });
					return;
				}
				
				// Grab info that user provided to service
				let data = JSON.parse(rows[0].info);
				
				// Pull data for service from profile
				if (data.profile) {
					// Grab requested info from service
					sql = "SELECT info FROM services WHERE id = ?";
					vars = [req.params.service];

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
							
							finish(provided);
						});
					});
				}
				// User provided custom data for service
				else {
					finish(data);
				}
			});
		});
	}));

}