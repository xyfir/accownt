const bcrypt = require("bcrypt");
const db = require("../../../lib/db.js");

/*
    PUT api/dashboard/account
    REQUIRED
        currentPassword: string, newPassword: string
    RETURN
        { error: boolean, message: string }
*/
module.exports = function(req, res) {
    
    db(cn => {
        cn.query("SELECT password FROM users WHERE id = ?", [req.session.uid], (err, rows) => {
            // Check if current password matches
            bcrypt.compare(req.body.currentPassword, rows[0].password, (err, match) => {
                
                if (match || req.session.recovered) {
                    bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                        // Update password
                        cn.query("UPDATE users SET password = ? WHERE id = ?", [hash, req.session.uid]);
                        res.json({error: false, message: "Password successfully updated"});
                    });
                    
                    req.session.recovered = false;
                }
                else {
                    res.json({error: true, message: "Incorrect password"});
                }
                
                cn.release();
            });
        });
    });

}