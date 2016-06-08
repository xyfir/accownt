const db = require("../../../lib/db");

/*
    GET api/dashboard/profiles
    RETURN
        {
            count: number, profiles: [{
                picture: string, name: string, profile_id: number
            }]
        }
*/
module.exports = function(req, res) {
    
    db(cn => {
        cn.query("SELECT picture, name, profile_id FROM profiles WHERE user_id = ?", [req.session.uid], (err, rows) => {
            cn.release();
            
            res.json({ count: rows.length, profiles: rows });
        });
    });

}