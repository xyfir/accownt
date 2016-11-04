const randomstring = require("randomstring");
const db = require("lib/db");

/*
	POST api/dashboard/developer/services/:id/key
	RETURNED
		{ error: boolean, key?: string }
	DESCRIPTION
		Generate a new service key for service
*/
module.exports = function(req, res) {
	
    const key = randomstring.generate(20);
    
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
            sql = "INSERT INTO service_keys (service_id, service_key) VALUES (?, ?)";
            vars = [req.params.id, key];

            cn.query(sql, vars, (err, result) => {
                cn.release();

                if (err || !result.affectedRows)
                    res.json({ error: true });
                else
                    res.json({ error: false, key });
            });
        }
    }));

}