var request = require("request");
var config = require("../../../config");
var db = require("../../../lib/db");

module.exports = {
	
	/*
		GET api/dashboard/ads
		RETURN
			{info: string/json-string}
	*/
	info: function(req, res) {
		db(function(cn) {
			cn.query('SELECT xad_id FROM users WHERE id = ?', [req.session.uid], function(err, rows) {
				cn.release();
				
				if (err || !rows.length) {
					res.json({info: ""});
					return;
				}
				
				request({
					url: config.xads + "api/xad-id/" + req.session.uid + "/" + rows[0].xad_id
						+ "?secret=" + config.keys.xadid,
				}, function(err, response, body) {
					if (err)
						res.json({info: ""});
					else
						res.json({info: JSON.parse(body).info});
				});
			});
		});
	},
	
	/*
		PUT api/dashboard/ads
		REQUIRED
			categories: string, keywords: string,
			age: number, gender: number
		RETURN
			{error: bool}
	*/
	update: function(req, res) {
		var info = {};
		if (req.body.categories != "") info.categories = req.body.categories;
		if (req.body.categories != "") info.keywords = req.body.keywords;
		if (req.body.categories != "") info.gender = req.body.gender;
		if (req.body.categories != "") info.age = req.body.age;
		
		info = JSON.stringify(info);
		
		if (info.length > 800) {
			res.json({error: true});
			return;
		}
		
		db(function(cn) {
			// Grab XADID
			cn.query("SELECT xad_id FROM users WHERE id = ?", [req.session.uid], function(err, rows) {
				if (err || !rows.length) {
					res.json({error: true});
					return;
				}
				
				// Attempt to update XAD Profile
				request({
					url: config.xads + "api/xad-id/" + req.session.uid + "/" + rows[0].xad_id,
					form: {
						secret: config.keys.xadid,
						info: info
					}
				}, function(err, response, body) {
					if (err)
						res.json({error: true});
					else
						res.json({error: JSON.parse(body).error});
				});
			});
		});
	}
	
};