const db = require("lib/db");

/*
    GET api/dashboard/user/services
    RETURN
        { services: [{ id: number, name: string }] }
	DESCRIPTION
		Return all linked services
*/
module.exports = function(req, res) {

	let sql = `
		SELECT id, name FROM services WHERE id IN (
			SELECT service_id FROM linked_services WHERE user_id = ?
		)
	`;
	
    db(cn => cn.query(sql, [req.session.uid], (err, rows) => {
		cn.release();
		res.json({ services: rows });
	}));

}