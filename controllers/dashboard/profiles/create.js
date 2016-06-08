const db = require("../../../lib/db");

/*
    POST api/dashboard/profiles
    REQUIRED
        **
    RETURN
        { error: bool, message: string }
*/
module.exports = function(req, res) {
    
    let profile = req.body;
    
    profile.user_id = req.session.uid;
    req.body = {};
    
    if (!require("../../../lib/profiles/isValid")(res, profile)) return;
    
    db(cn => {			
        cn.query("INSERT INTO profiles SET ?", profile, (err, result) => {
            cn.release();
            
            if (err || !result.insertId)
                res.json({error: true, message: "An unknown error occured."});
            else
                res.json({error: false, message: "Profile successfully created."});
        });
    });
    
}