const db = require("../../../lib/db");

/*
    PUT api/dashboard/services/:service
	REQUIRED
		**
    RETURN
        { error: bool, message: string }
*/
module.exports = function(req, res) {
	
    // Validate data
	require("../../../lib/services/validateData")(req, (result, update) => {
		if (result != "valid") {
			res.json({error: true, message: result});
			return;
		}
		
		db(cn => {
			connection.query(
				"UPDATE linked_services SET info = ? WHERE user_id = ? AND service_id = ?",
				[JSON.stringify(update), req.session.uid, req.params.service],
				(err, result) => {
					connection.release();
					
					if (err)
						res.json({error: true, message: "Could not update data."});
					else
						res.json({error: false, message: "Service successfully updated."});
				}
			);
		});
	});

}