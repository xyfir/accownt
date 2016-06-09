const db = require("../../lib/db");

/*
	GET api/service/dashboard/:id
	RETURN
		{ services_table_row }
*/
module.exports = function(req, res) {
	
    db(cn => {
		const sql = "SELECT * FROM services WHERE owner = ? AND id = ?";
		cn.query(sql, [req.session.uid, req.params.id], (err, rows) => {
			cn.release();
			
			res.json(rows[0]);
		});
	});

}