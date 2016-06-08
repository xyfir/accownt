const db = require("../../../lib/db");

/*
    PUT api/dashboard/security/passwordless
    REQUIRED
        passwordless: number
    RETURN
        { error: bool, message: string }
*/
module.exports = function(req, res) {
    
    // Validate data
    if (req.body.passwordless > 6) {
        res.json({error: true, message: "Invalid data."});
        return;
    }
    
    db(cn => {
        cn.query("UPDATE security SET passwordless = ? WHERE user_id = ?", [req.body.passwordless, req.session.uid], (err, result) => {
            cn.release();
            
            if (err || !result.affectedRows)
                res.json({ error: true, message: "An unknown error occured" });
            else
                res.json({error: false, message: "Passwordless login option successfully updated."});
        });
    });

}