const db = require("../../../lib/db");

/*
    GET api/dashboard/services
    RETURN
        { services: [{ service_id: number }] }
*/
module.exports = function(req, res) {
	
    db(cn => {
		connection.query("SELECT service_id FROM linked_services WHERE user_id = ?", [req.session.uid], (err, rows) => {
			connection.release();
			
			// Create array of service objects containing service id"s
			let services = [];
			rows.forEach(row => {
				services.push({id: row.service_id});
			});
			
			
			res.json({ services });
		});
	});

}