const db = require("../../../lib/db");

/*
    PUT api/dashboard/security/phone
    REQUIRED
        phone: string
    RETURN
        { error: bool, message: string }
*/
module.exports = function(req, res) {
		
    db(cn => {
        cn.query("UPDATE security SET phone = ? WHERE user_id = ?", [req.body.phone, req.session.uid], (err, result) => {
            cn.release();
            
            if (err || !result.affectedRows)
                res.json({ error: true, message: "An unknown error occured" });
            else if (req.body.phone != 0)
                require("../../../lib/sms/sendCode")(req.session.uid, req.body.phone);
        });
    });

}