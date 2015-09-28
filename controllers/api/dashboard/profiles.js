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
				
				res.json({error: false, message: "", profile: rows[0]});
			});
		});
	},
	
	isProfileValid: function(res, profile) {
		if (profile.name.length > 25 || profile.name.length == 0) {
			res.json({error: true, message: "Profile name must be 1-25 characters long."});
			return false;
		}
		else if (profile.fname.length > 50 || profile.lname.length > 50) {
			res.json({error: true, message: "First and last name fields limited to 50 characters."});
			return false;
		}
		else if (profile.address.length > 100) {
			res.json({error: true, message: "Street address 100 character limit exceeded."});
			return false;
		}
		else if (profile.zip.length > 10) {
			res.json({error: true, message: "Zip 10 character limit exceeded."});
			return false;
		}
		else if (profile.region.length > 25) {
			res.json({error: true, message: "State/Region/Province 25 character limit exceeded."});
			return false;
		}
		else if (profile.country.length != 0 && profile.country.length != 2) {
			res.json({error: true, message: "Country must be a two-letter ISO 3166-1 country code."});
			return false;
		}
		else if (profile.email.length > 0) {
			var regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
			if (!regex.test(profile.email)) {
				res.json({error: true, message: "Invalid email address provided."});
				return false;
			}
		}
		else if (profile.phone.length > 15) {
			res.json({error: true, message: "Phone number 15 character limit exceeded."});
			return false;
		}
		else if (profile.gender > 3) {
			res.json({error: true, message: "Invalid gender provided."});
			return false;
		}
		else if (profile.birthdate.length != 0 && profile.birthdate.length != 0) {
			res.json({error: true, message: "Invalid birthdate provided."});
			return false;
		}
		else if (profile.picture.length > 0) {
			var picture = profile.picture.split('-');
			
			// Profile picture token == <user_id>-<random_string>
			if (picture[0] != profile.user_id || !picture[1].match(/^[a-z0-9]{10}$/)) {
				res.json({error: true, message: "An error occured attempting to process your profile picture."});
				return false;
			}
		}
		
		return true;
	},
	
	update: function(req, res) {
		var profile = req.body;
		req.body = {};
		
		if (!this.isProfileValid(res, profile)) return;
		
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
		
		if (!this.isProfileValid(res, profile)) return;
		
		db(function(connection) {			
			connection.query('INSERT INTO profiles SET ?', profile, function(err, result) {
				connection.release();
				
				if (err || !result.insertId)
					res.json({error: true, message: "An unknown error occured."});
				else
					res.json({error: false, message: "", profile_id: result.insertId});
			});
		});
	},
	
	picture: function(req, res) {

	}
	
};