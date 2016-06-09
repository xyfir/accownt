const buildInfo = require("../../../lib/service/buildInfo");
const validate = require("../../../lib/service/validate");
const db = require("../../../lib/db");

/*
	POST api/service/dashboard
	REQUIRED
		info: json-string
			{fname:{optional:bool,required:bool,value:string},lname:{...},...}
		name: string, link: string, description: string
	RETURN
		{ error: bool, message: string }
*/
module.exports = function(req, res) {
	
    const response = validate(req.body);
	
	if (response != "") {
		res.json({error: true, message: response});
		return;
	}
	
	db(cn => {
		let sql = "SELECT * FROM services WHERE name = ?";
		
		// Check if a service with that name already exists
		cn.query(sql, [req.body.name], (err, rows) => {
			if (rows.length > 0) {
				cn.release();
				res.json({error: true, message: "A service with that name already exists"});
				return;
			}
			
			sql = "INSERT INTO services SET ?", req.body.info = buildInfo(req.body.info);
			
			const data = {
				info: req.body.info,
				name: req.body.name,
				address: req.body.link,
				owner: req.session.uid,
				xyfir: req.session.uid < 1000,
				description: req.body.description
			};
			
			cn.query(sql, data, (err, result) => {
				cn.release();
				
				if (err || !result.affectedRows)
					res.json({error: true, message: "An unknown error occured"});
				else
					res.json({error: false, message: "Service successfully created"});
			});
		});
	});

}