const db = require("../../../lib/db.js");

/*
    GET api/dashboard/account
    RETURN
        { loggedIn: boolean, email?: string, recovered?: boolean }
*/
module.exports = function(req, res) {

    if (!req.session.uid) {
        res.json({ loggedIn: false });
        return;
    }
    
    db(cn => {
        cn.query("SELECT email FROM users WHERE id = ?", [req.session.uid], (err, rows) => {
            cn.release();
            
            if (err || !rows.length) {
                res.json({ loggedIn: false });
            }
            else {
                res.json({
                    email: rows[0].email, recovered: req.session.recovered,
                    loggedIn: true
                });
            }
        });
    });

}