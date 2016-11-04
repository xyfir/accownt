const isProfileValid = require("lib/profiles/isValid");
const db = require("lib/db");

/*
    POST api/dashboard/user/profiles
    REQUIRED
        **
    RETURN
        { error: bool, message: string }
*/
module.exports = function(req, res) {
    
    let profile = req.body;
    
    profile.user_id = req.session.uid;
    req.body = {};
    
    if (!isProfileValid(res, profile)) return;
    
    db(cn => {			
        cn.query("INSERT INTO profiles SET ?", profile, (err, result) => {
            cn.release();
            
            if (err || !result.insertId)
                res.json({ error: true, message: "An unknown error occured." });
            else
                res.json({ error: false, message: "Profile successfully created." });
        });
    });
    
}