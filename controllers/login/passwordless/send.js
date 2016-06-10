const db = require("../../../lib/db");

/*
    GET api/login/passwordless/:email
    RETURN
        { error: bool, message: string }
    DESCRIPTION
        Send user a passwordless login link via sms / email if enabled
*/
module.exports = function(req, res) {

    db(cn => {
        cn.query("SELECT id FROM users WHERE email = ?", [req.params.email], (err, rows) => {
            if (rows.length == 0) {
                cn.release();
                res.json({error: true, message: "An error occured."});
                return;
            }
            
            const uid = rows[0].id;
            
            cn.query("SELECT phone, passwordless FROM security WHERE user_id = ?", [uid], (err, rows) => {
                cn.release();
                
                if (rows[0].passwordless == 0) {
                    res.json({error: true, message: "Passwordless login not enabled."});
                    return;
                }
                
                require("../../../lib/auth/generateToken")([uid], token => {
                    const link = "https://accounts.xyfir.com/api/login/passwordless/" + uid + "/" + token;
                    
                    // Send via sms
                    if (rows[0].passwordless == 1 || rows[0].passwordless == 3)
                        require("../../../lib/sms/sendPasswordless")(rows[0].phone, link);
                    // Send via email
                    if (rows[0].passwordless == 2 || rows[0].passwordless == 3)
                        require("../../../lib/email/sendPasswordless")(req.params.email, link);
                        
                    res.json({
                        error: false,
                        message: "Passwordless login link sent. It will expire in 10 minutes."
                    });
                });
            });
        });
    });

}