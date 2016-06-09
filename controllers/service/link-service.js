const db = require("../../lib/db");

/*
	POST api/service/link/:service
	RETURNED
		{ error: bool, message: string }
	DESCRIPTION
		Link service to user"s Xyfir Account
*/
module.exports = function(req, res) {
	
    // Check if user provided required information
	require("../../lib/services/validateData")(req, (result, info) => {
		if (result == "valid") {
			// Generate xyfir id
			const xid = require("crypto")
				.createHash("sha256")
				.update(
                    req.session.uid + "-" + req.params.service
                    + "-" + (Math.random() * 1000000)
                ).digest("hex");
			
			const insert = {
				user_id: req.session.uid,
				service_id: req.params.service,
				xyfir_id: xid,
				info: JSON.stringify(info)
			};
			
			db(cn => {
				// Create row in linked_services
				cn.query("INSERT INTO linked_services SET ?", insert, (err, result) => {
					cn.release();
					
					if (err)
						res.json({error: true, message: "An unknown error occured."});
					else
						res.json({error: false, message: "Service linked to account."});
				});
			});
		}
		else {
			res.json({error: true, message: result});
		}
	});

}