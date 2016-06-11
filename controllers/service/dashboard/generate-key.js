const randomstring = require("randomstring");
const db = require("../../../lib/db");

/*
	PUT api/service/dashboard/:id/key
	RETURNED
		{ error: boolean, key?: string }
	DESCRIPTION
		Regenerate service's private key
*/
module.exports = function(req, res) {
	
    const key  = randomstring.generate(20);
    const sql  = "UPDATE services SET service_key = ? WHERE id = ? AND owner = ?";
    const vars = [key, req.params.id, req.session.uid];

    db(cn => cn.query(sql, vars, (err, result) => {
        cn.release();
        
        if (err | !result.affectedRows)
            res.json({ error: true });
        else
            res.json({ error: false, key });
    }));

}