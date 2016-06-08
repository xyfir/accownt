var db = require('../../../lib/db');

module.exports = {
	
	getAll: function(req, res) {
		db(function(connection) {
			connection.query('SELECT picture, name, profile_id FROM profiles WHERE user_id = ?', [req.session.uid], function(err, rows) {
				connection.release();
				
				if (rows.length == 0) {
					res.json({count: 0});
					return;
				}
				
				var profiles = [];
				
				rows.forEach(function(profile) {
					profiles.push(profile);
				});
				
				res.json({count: profiles.length, profiles: profiles});
			});
		});
	},
	
	getSingle: function(req, res) {
		db(function(connection) {
			connection.query('SELECT * FROM profiles WHERE profile_id = ? AND user_id = ?', [req.params.profile, req.session.uid], function(err, rows) {
				connection.release();
				
				if (rows.length == 0) {
					res.json({error: true, message: "Profile does not exist."});
					return;
				}
				
				if (rows[0].birthdate == "0000-00-00")
					rows[0].birthdate = "";
				
				res.json({error: false, message: "", profile: rows[0]});
			});
		});
	},
	
	update: function(req, res) {
		var profile = req.body;
		req.body = {};
		
		if (!require('../../../lib/profiles/isValid')(res, profile)) return;
		
		db(function(connection) {
			var sql = 'UPDATE security SET '
				+ 'name = ?, fname = ?, lname = ?, address = ?, zip = ?, region = ?, '
				+ 'country = ?, email = ?, phone = ?, gender = ?, birthdate = ?, picture = ? '
				+ 'WHERE user_id = ? AND profile_id = ?';
			var values = [
				profile.name, profile.fname, profile.lname, profile.address, profile.zip,
				profile.region, profile.country, profile.email, profile.phone,
				profile.gender, profile.birthdate, profile.picture,
				req.session.uid, req.params.profile
			];
			
			connection.query(sql, values, function(err, result) {
				connection.release();
				
				if (!err)
					res.json({error: false, message: "Profile successfully updated."});
				else
					res.json({error: true, message: "An unknown error occured."});
			});
		});
	},
	
	remove: function(req, res) {
		db(function(connection) {
			connection.query('DELETE FROM profiles WHERE profile_id = ? AND user_id = ?', [req.params.profile, req.session.uid], function(err, result) {
				connection.release();
				
				if (!err)
					res.json({error: false, message: "Profile successfully deleted."});
				else
					res.json({error: true, message: "An unknown error occured."});
			});
		});
	},
	
	create: function(req, res) {
		var profile = req.body;
		profile.user_id = req.session.uid;
		req.body = {};
		
		if (!require('../../../lib/profiles/isValid')(res, profile)) return;
		
		db(function(connection) {			
			connection.query('INSERT INTO profiles SET ?', profile, function(err, result) {
				connection.release();
				
				if (err || !result.insertId)
					res.json({error: true, message: "An unknown error occured."});
				else
					res.json({error: false, message: "Profile successfully created."});
			});
		});
	},
	
	picture: function(req, res) {

	}
	
};