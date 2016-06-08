const db = require("../../../lib/db");

/*
    DELETE api/dashboard/profiles/:profile
    RETURN
        { error: bool, message: string }
*/
module.exports = function(req, res) {
    
    db(cn => {
        cn.query("DELETE FROM profiles WHERE profile_id = ? AND user_id = ?", [req.params.profile, req.session.uid], err, result => {
            cn.release();
            
            if (!err)
                res.json({error: false, message: "Profile successfully deleted."});
            else
                res.json({error: true, message: "An unknown error occured."});
        });
    });

}