const db = require("../../../lib/db");

/*
	DELETE api/service/dashboard/:id/key
    REQUIRED
        key: string
	RETURNED
		{ error: boolean }
	DESCRIPTION
		Delete a service key
*/
module.exports = function(req, res) {
    
    let sql  = `
        SELECT * FROM services WHERE id = ? AND owner = ?
    `, vars = [
        req.params.id, req.session.uid
    ];

    db(cn => cn.query(sql, vars, (err, rows) => {
        if (err || !rows.length) {
            cn.release();
            res.json({ error: true });
        }
        else {
            sql = "DELETE FROM service_keys WHERE service_id = ? AND service_key = ?";
            vars = [req.params.id, req.body.key];

            cn.query(sql, vars, (err, result) => {
                cn.release();
                res.json({ error: !!err });
            });
        }
    }));

}