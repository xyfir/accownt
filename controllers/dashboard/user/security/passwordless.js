const db = require("lib/db");

/*
    PUT api/dashboard/user/security/passwordless
    REQUIRED
        passwordless: number
    RETURN
        { error: bool, message: string }
*/
module.exports = function(req, res) {
    
    // Validate data
    if (req.body.passwordless > 2) {
        res.json({ error: true, message: "Invalid data." });
        return;
    }
    
    let sql = "UPDATE security SET passwordless = ? WHERE user_id = ?"; 
    let vars = [req.body.passwordless, req.session.uid];

    db(cn => cn.query(sql, vars, (err, result) => {
        cn.release();
        
        if (err || !result.affectedRows) {
            res.json({ error: true, message: "An unknown error occured" });
        }
        else {
            res.json({
                error: false,
                message: "Passwordless login option successfully updated."
            });
        }
    }));

}