var db = require('../../lib/db');

module.exports = {
	
	getUser: function(req, res) {
		db(function(connection) {
			// Check if xid+serviceid matches
			connection.query(
				'SELECT user_id, info FROM linked_services WHERE service_id = ? AND xyfir_id = ?',
				[req.params.service, req.params.xid], function(err, rows) {

					if (err || rows.length == 0) {
						res.json({error: true});
						return;
					}
					
					// Check if auth token is valid
					require('../../lib/auth/validateToken')
					([rows[0].user_id, req.params.service], req.params.token, function(isValid) {
						if (!isValid) {
							res.json({error: true});
							return;
						}
						
						// Grab info that user provided to service
						var data = JSON.parse(rows[0].info);
						
						if (data.profile) {
							
							// Grab requested info from service
							connection.query('SELECT info FROM services WHERE id = ?', [req.params.service], function(err, rows) {
								var requested = JSON.parse(rows[0].info);
								
								// Grab data from profile
								connection.query('SELECT * FROM profiles WHERE profile_id = ?', [data.profile], function(err, rows) {
									connection.release();
									var provided = {};
									
									// Loop through requested.required and add data
									for (var key in requested.required) {
										if (!requested.required.hasOwnProperty(key))
											continue;
										
										// Copy profile's data to provided's data
										// required.name: provided.name = profile.name
										provided[key] = rows[0][key];
									}
									
									// Loop through requested.optional if optional and add data
									if (data.optional) {
										for (var key in requested.optional) {
											if (!requested.optional.hasOwnProperty(key))
												continue;
											
											// Copy profile's data to provided's data
											provided[key] = rows[0][key];
										}
									}
									
									res.json(provided);
								});
							});
						}
						else {
							connection.release();
							
							// Return custom data
							res.json(data);
						}
					});
				}
			);
		});
	},
	
	linkService: function(req, res) {
		// Check if user provided required information
		require('../../lib/services/validateData')(req, function(result, info) {
			if (result == 'valid') {
				// Generate xyfir id
				var xid = require('crypto')
					.createHash('sha256')
					.update(req.session.uid + '-' + req.params.service + '-' + (Math.random() * 1000000))
					.digest('hex');
				
				var insert = {
					user_id: req.session.uid,
					service_id: req.params.service,
					xyfir_id: xid,
					info: JSON.stringify(info)
				};
				
				db(function(connection) {
					// Create row in linked_services
					connection.query('INSERT INTO linked_services SET ?', insert, function(err, result) {
						connection.release();
						
						if (err)
							res.json({error: true, message: "An unknown error occured."});
						else
							res.json({error: false, message: "Service linked to account."});
					});
				});
			}
			else {
				res.json({error: true, message: result});
			}
		});
	},
	
	createSession: function(req, res) {
		// Generate an auth token for uid/service
		require('../../lib/auth/generateToken')([req.session.uid, req.params.service], function(token, xid) {
			db(function(connection) {
				connection.query('SELECT address FROM services WHERE id = ?', [req.params.service], function(err, rows) {
					connection.release();
					res.json({auth: token, xid: xid, address: rows[0].address});
				});
			});
		});
	},
	
	info: function(req, res) {
		db(function(connection) {
			connection.query('SELECT name, description, info FROM services WHERE id = ?', [req.params.service], function(err, rows) {
				
				if (err || rows.length == 0) {
					connection.release();
					res.json({error: true, message: "Service does not exist."});
					return;
				}
				
				var data = {
					name: rows[0].name,
					description: rows[0].description,
					requested: JSON.parse(rows[0].info)
				};
				
				// Check if user is already linked to service
				connection.query('SELECT xyfir_id FROM linked_services WHERE user_id = ? AND service_id = ?',
				[req.session.uid, req.params.service], function(err, rows) {
					if (rows.length > 0) {
						connection.release();
						res.json({error: true, message: "Service is already linked to account."});
						return;
					}
					
					// Grab user's profiles
					connection.query('SELECT profile_id, name FROM profiles WHERE user_id = ?', [req.session.uid], function(err, rows) {
						connection.release();
						
						// profiles: [{name,profile_id},{...}]
						res.json({error: false, message: "", service: data, profiles: rows});
					});
				})
			});
		});
	}
	
};