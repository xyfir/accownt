const generateToken = require("lib/tokens/generate");
const db = require("lib/db");

const config = require("config");

/*
	POST api/service/session/:service
	RETURNED
		{ auth: string, xid: string, address: string }
	DESCRIPTION
		Returns user/service's Xyfir ID and session auth token
		Returns address for redirecting upon successful login to XAcc
*/
module.exports = function(req, res) {
	
    // Generate an auth token for uid with service
	generateToken({
		user: req.session.uid, service: req.params.service, type: 1
	}, (token, xid) => {
		// Get service's address to redirect to
		let sql = `
			SELECT address FROM services WHERE id = ?
		`, vars = [
			req.params.service
		];

		db(cn => cn.query(sql, vars, (err, rows) => {
			cn.release();

			if (err || !rows.length)
				res.json({ auth: "", xid: "", address: config.addresses.xacc });
			else
				res.json({ auth: token, xid, address: rows[0].address });
		}));
	});

}