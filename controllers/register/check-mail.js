const db = require("../../lib/db"); 

/*
    GET api/register/email/:email
    RETURN
        0 = OK, 1 = ERROR
*/
module.exports = function(req, res) {
		
    // Check if email is valid / available
    // 0 == email available, 1 == unavailable
    db(cn => {
        cn.query("SELECT id FROM users WHERE email = ? AND verified = ?", [req.params.email, 1], (err, rows) => {
            cn.release();
            res.send(rows.length + "");
        });
    });
	
};