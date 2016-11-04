const db = require("lib/db");

/*
    PUT api/dashboard/user/security/whitelist
    REQUIRED
        whitelist: string
    RETURN
        { error: bool, message: string }
*/
module.exports = function(req, res) {
		
    // Validate data
    if (req.body.whitelist.length > 239) {
        res.json({error: true, message: "Total length of whitelist cannot exceed 239 characters."})
        return;
    }
    
    db(cn => {
        cn.query("UPDATE security SET addresses = ? WHERE user_id = ?", [req.body.whitelist, req.session.uid], (err, result) => {
            cn.release();
            
            res.json({error: false, message: "IP address whitelist successfully updated."});
        });
    });

}