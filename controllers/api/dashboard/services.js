var db = require('../../../lib/db');

module.exports = {
	
	getAll: function(req, res) {
		db(function(connection) {
			connection.query('SELECT service_id FROM linked_services WHERE user_id = ?', [req.session.uid], function(err, rows) {
				connection.release();
				
				// Create array of service objects containing service id's
				var services = [];
				rows.forEach(function(row) {
					services.push({id: row.service_id});
				});
				
				
				res.json({services: services});
			});
		});
	},
	
	getSingle: function(req, res) {
		db(function(connection) {
			connection.query('SELECT name, description, info FROM services WHERE id = ?', [req.params.service], function(err, rows) {
				if (err || rows.length == 0) {
					res.json({error: true});
					return;
				}
				
				var data = {
					name: rows[0].name,
					description: rows[0].description,
					info: {
						requested: JSON.parse(rows[0].info)
					}
				};
				
				connection.query(
					'SELECT info FROM linked_services WHERE user_id = ? AND service_id = ?',
					[req.session.uid, req.params.service],
					function(err, rows) {
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
	},
	
	update: function(req, res) {
		// Validate data
		require('../../../lib/services/validateData')(req, function(result) {
			if (result != 'valid') {
				res.json({error: true, message: result});
				return;
			}
				
			var update;
			
			if (req.body.profile) {
				update = {
					profile: req.body.profile,
					optional: req.body.optional
				};
			}
			else {
				update = {
					email: req.body.email,
					fname: req.body.fname,
					lname: req.body.lname,
					gender: req.body.gender,
					phone: req.body.phone,
					birthdate: req.body.birthdate,
					address: req.body.address,
					zip: req.body.zip,
					region: req.body.region,
					country: req.body.country
				};
			}
			
			db(function(connection) {
				connection.query(
					'UPDATE linked_services SET info = ? WHERE user_id = ? AND service_id = ?',
					[JSON.stringify(update), req.session.uid, req.params.service],
					function(err, result) {
						connection.release();
						
						if (err)
							res.json({error: true, message: "Could not update data."});
						else
							res.json({error: false, message: "Service successfully updated."});
					}
				);
			});
		});
	},
	
	remove: function(req, res) {
		db(function(connection) {
			connection.query(
				'DELETE FROM linked_services WHERE user_id = ? AND service_id = ?',
				[req.session.uid, req.params.service],
				function(err, result) {
					connection.release();
					res.json({error: false, message: "Successfully unlinked service from account."});
				}
			);
		});
	}
	
};