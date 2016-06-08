var buildInfo = require("../../lib/service/buildInfo");
var validate = require("../../lib/service/validate");
var db = require("../../lib/db");

module.exports = {

	/*
		GET api/service/dashboard
		RETURN
			{services: [
				{ id: number, name: string }
			]}
	*/
	getAll: function(req, res) {
		db(function(cn) {
			var sql = "SELECT id, name FROM services WHERE owner = ?";
			cn.query(sql, [req.session.uid], function(err, rows) {
				cn.release();
				
				res.json({services: rows});
			});
		});
	},
	
	/*
		GET api/service/dashboard/:id
		RETURN
			{ services_table_row }
	*/
	getSingle: function(req, res) {
		db(function(cn) {
			var sql = "SELECT * FROM services WHERE owner = ? AND id = ?";
			cn.query(sql, [req.session.uid, req.params.id], function(err, rows) {
				cn.release();
				
				res.json(rows[0]);
			});
		});
	},
	
	/*
		POST api/service/dashboard
		REQUIRED
			info: json-string
				{fname:{optional:bool,required:bool,value:string},lname:{...},...}
			name: string, link: string, description: string
		RETURN
			{ error: bool, message: string }
	*/
	create: function(req, res) {
		var response = validate(req.body);
		
		if (response != "") {
			res.json({error: true, message: response});
			return;
		}
		
		db(function(cn) {
			var sql = "SELECT * FROM services WHERE name = ?";
			
			// Check if a service with that name already exists
			cn.query(sql, [req.body.name], function(err, rows) {
				if (rows.length > 0) {
					cn.release();
					res.json({error: true, message: "A service with that name already exists"});
					return;
				}
				
				sql = "INSERT INTO services SET ?", req.body.info = buildInfo(req.body.info);
				
				var data = {
					info: req.body.info,
					name: req.body.name,
					address: req.body.link,
					owner: req.session.uid,
					xyfir: req.session.uid < 1000,
					description: req.body.description
				};
				
				cn.query(sql, data, function(err, result) {
					cn.release();
					
					if (err || !result.affectedRows)
						res.json({error: true, message: "An unknown error occured"});
					else
						res.json({error: false, message: "Service successfully created"});
				});
			});
		});
	},
	
	/*
		PUT api/service/dashboard/:id
		REQUIRED
			info: json-string
				{fname:{optional:bool,required:bool,value:string,why:string},lname:{...},...}
			name: string, link: string, description: string
		RETURN
			{ error: bool, message: string }
	*/
	edit: function(req, res) {
		var response = validate(req.body);
		
		if (response != "") {
			res.json({error: true, message: response});
			return;
		}
		
		db(function(cn) {
			var sql = "UPDATE services SET name = ?, description = ?, info = ?, address = ? "
				+ "WHERE id = ? AND owner = ?";
			
			var data = [
				req.body.name, req.body.description, buildInfo(req.body.info), req.body.link,
				req.params.id, req.session.uid
			];
			
			cn.query(sql, data, function(err, result) {
				cn.release();
				
				if (err || !result.affectedRows)
					res.json({error: true, message: "An unknown error occured"});
				else
					res.json({error: false, message: "Service successfully updated"});
			});
		});
	},
	
	/*
		DELETE api/service/dashboard/:id
		RETURN
			{ error: bool, message: string }
		DESCRIPTION
			Deletes service from services table
			Deletes all rows in linked_services where id matches
	*/
	remove: function(req, res) {
		db(function(cn) {
			var sql = "DELETE FROM services WHERE owner = ? AND id = ?";
			cn.query(sql, [req.session.uid, req.params.id], function(err, result) {
				if (err || !result.affectedRows) {
					res.json({ error: true, message: "An unknown error occured" });
				}
				else {
					res.json({ error: false, message: "Service deleted successfully" });
					
					sql = "DELETE FROM linked_services WHERE service_id = ?";
					cn.query(sql, [req.params.id], function(err, result) {
						cn.release();
					});
				}
			});
		});
	}
	
};