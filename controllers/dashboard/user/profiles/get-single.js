const db = require("lib/db");

/*
    GET api/dashboard/user/profiles/:profile
    RETURN
        { error: bool, message: string, profile: { ** } }
*/
module.exports = function(req, res) {
    
    db(cn => {
        cn.query("SELECT * FROM profiles WHERE profile_id = ? AND user_id = ?", [req.params.profile, req.session.uid], (err, rows) => {
            cn.release();
            
            if (rows.length == 0) {
                res.json({ error: true, message: "Profile does not exist." });
                return;
            }
            
            if (rows[0].birthdate == "0000-00-00")
                rows[0].birthdate = "";
            
            res.json({ error: false, message: "", profile: rows[0] });
        });
    });

}