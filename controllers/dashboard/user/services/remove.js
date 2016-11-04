const db = require("lib/db");

/*
    DELETE api/dashboard/user/services/:service
    RETURN
        { error: bool, message: string }
*/
module.exports = function(req, res) {
	
    db(cn => {
		cn.query(
			"DELETE FROM linked_services WHERE user_id = ? AND service_id = ?",
			[req.session.uid, req.params.service],
			(err, result) => {
				cn.release();
				res.json({error: false, message: "Successfully unlinked service from account."});
			}
		);
	});

}