const db = require("../../../lib/db");

/*
    GET api/dashboard/security
    RETURN
        {
            phone: string, codes: string, whitelist: string,
            passwordless: boolean
        }
*/
module.exports = function(req, res) {
    
    db(cn => {
        cn.query("SELECT * FROM security WHERE user_id = ?", [req.session.uid], (err, rows) => {
            cn.release();
            res.json({
                phone: rows[0].phone,
                codes: rows[0].codes,
                whitelist: rows[0].addresses,
                passwordless: rows[0].passwordless
            });
        });
    });

}