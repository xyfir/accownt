const buildInfo = require("../../../lib/service/buildInfo");
const validate = require("../../../lib/service/validate");
const db = require("../../../lib/db");

/*
	PUT api/service/dashboard/:id
	REQUIRED
		info: json-string
			{fname:{optional:bool,required:bool,value:string,why:string},lname:{...},...}
		name: string, link: string, description: string
	RETURN
		{ error: bool, message: string }
*/
module.exports = function(req, res) {
	
    const response = validate(req.body);
	
	if (response != "") {
		res.json({ error: true, message: response });
		return;
	}
	
	db(cn => {
		const sql = "UPDATE services SET name = ?, description = ?, info = ?, address = ? "
			+ "WHERE id = ? AND owner = ?";
		
		const data = [
			req.body.name, req.body.description, buildInfo(req.body.info), req.body.link,
			req.params.id, req.session.uid
		];
		
		cn.query(sql, data, (err, result) => {
			cn.release();
			
			if (err || !result.affectedRows)
				res.json({ error: true, message: "An unknown error occured" });
			else
				res.json({ error: false, message: "Service successfully updated" });
		});
	});

}