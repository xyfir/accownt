const db = require("../../../lib/db.js");

/*
    GET api/dashboard/account
    RETURN
        { email: string, recovered: boolean }
*/
module.exports = function(req, res) {
    
    db(cn => {
        cn.query("SELECT email FROM users WHERE id = ?", [req.session.uid], (err, rows) => {
            cn.release();
            res.json({
                email: rows[0].email, recovered: req.session.recovered
            });
        });
    });

}