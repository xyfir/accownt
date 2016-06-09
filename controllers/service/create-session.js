const db = require("../../lib/db");

/*
	POST api/service/session/:service
	RETURNED
		{ auth: string, xid: string, address: string }
	DESCRIPTION
		Returns user/service"s Xyfir ID and session auth token
		Returns address for redirecting upon successful login to XAcc
*/
module.exports = function(req, res) {
	
    // Generate an auth token for uid/service
	require("../../lib/auth/generateToken")
    ([req.session.uid, req.params.service], (token, xid) => {
		db(cn => {
			cn.query("SELECT address FROM services WHERE id = ?", [req.params.service], (err, rows) => {
				cn.release();
				res.json({ auth: token, xid: xid, address: rows[0].address });
			});
		});
	});

}