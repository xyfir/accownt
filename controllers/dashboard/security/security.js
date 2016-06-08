var config = require('../../../config');
var db = require('../../../lib/db');

module.exports = {
	
	info: function(req, res) {
		db(function(connection) {
			connection.query("SELECT * FROM security WHERE user_id = ?", [req.session.uid], function(err, rows) {
				connection.release();
				res.json({
					phone: rows[0].phone,
					codes: rows[0].codes,
					whitelist: rows[0].addresses,
					passwordless: rows[0].passwordless
				});
			});
		});
	},
	
	codes: function(req, res) {
		// Check if user is removing all codes
		if (req.body.count == 0) {
			db(function(connection) {
				connection.query('UPDATE security SET codes = "" WHERE user_id = ?', [req.session.uid], function(err, result) {
					connection.release();
					res.json({error: false, codes: "", message: "Security codes removed from account."});
				});
			});
			return;
		}
		
		// Check provided data
		if (req.body.type > 3 || req.body.type == 0 || req.body.count > 20 || req.body.count < 5) {
			res.json({error: true, message: "Invalid data."});
			return;
		}
		
		// req.body.type: 1 = numbers, 2 = words, 3 = both
		var codes = [];
		var words = 0;
		var numbers = 0;
		
		// Calculate number of numbers to generate
		if (req.body.type == 1)
			numbers = req.body.count;
		else if (req.body.type == 3)
			numbers = Math.floor(Math.random() * req.body.count);
		
		// Calculate number of words to generate
		if (req.body.type == 2)
			words = req.body.count;
		else if (req.body.type == 3)
			words = req.body.count - numbers;
			
		// Add random numbers to list
		for (var i = 0; i < numbers; i++) {
			// 1000 - 9999
			codes.push(Math.floor(Math.random() * (10000 - 1000) + 1000));
		}
		
		var success = function() {
			// Shuffle array
			for (var i = codes.length - 1; i > 0; i--) {
				var j = Math.floor(Math.random() * (i + 1));
				var temp = codes[i];//te
				codes[i] = codes[j];
				codes[j] = temp;
			}
			
			// Save list to database
			db(function(connection) {
				connection.query('UPDATE security SET codes = ? WHERE user_id = ?', [codes.toString(), req.session.uid], function(err, result) {
					connection.release();
					
					res.json({codes: codes.toString(), error: false, message: "Security codes successfully updated."});
				});
			});
		};
		
		if (req.body.type == 1)
			success();
		
		// Add random words to list
		for (var i = 0; i < words; i++) {
			require('request')(
				config.randword + config.keys.randword + '?count=' + words,
				function(err, response, body) {
					JSON.parse(body).words.forEach(function(word) {
						codes.push(word);
					});
					
					success();
				}
			);
		}
	},
	
	whitelist: function(req, res) {
		// Validate data
		if (req.body.whitelist.length > 239) {
			res.json({error: true, message: "Total length of whitelist cannot exceed 239 characters."})
			return;
		}
		
		db(function(connection) {
			connection.query('UPDATE security SET addresses = ? WHERE user_id = ?', [req.body.whitelist, req.session.uid], function(err, result) {
				connection.release();
				
				res.json({error: false, message: "IP address whitelist successfully updated."});
			});
		});
	},
	
	passwordless: function(req, res) {
		// Validate data
		if (req.body.passwordless > 6) {
			res.json({error: true, message: "Invalid data."});
			return;
		}
		
		db(function(connection) {
			connection.query('UPDATE security SET passwordless = ? WHERE user_id = ?', [req.body.passwordless, req.session.uid], function(err, result) {
				connection.release();
				
				res.json({error: false, message: "Passwordless login option successfully updated."});
			});
		});
	},
	
	phone: function(req, res) {
		db(function(connection) {
			connection.query("UPDATE security SET phone = ? WHERE user_id = ?", [req.body.phone, req.session.uid], function(err, result) {
				connection.release();
				
				if (req.body.phone != 0)
					require('../../../lib/sms/sendCode')(req.session.uid, req.body.phone);
			});
		});
	},
	
	verifyPhone: function(req, res) {
		require('../../../lib/sms/verifyCode')(req.session.uid, req.body.code, function(isValid) {
			if (isValid)
				res.json({error: false, message: "Successfully updated phone number."});
			else
				res.json({error: true, message: "Invalid security code."});
		});
	},
	
};