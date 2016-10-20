const sendPasswordlessEmail = require("lib/email/send-passwordless");
const sendPasswordlessSMS = require("lib/sms/send-passwordless");
const generateToken = require("lib/tokens/generate");
const db = require("lib/db");

/*
    GET api/login/passwordless/:email
    RETURN
        { error: bool, message: string, passwordless?: number }
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
                
                generateToken({
                    user: uid, type: 1
                }, token => {
                    // Send via sms
                    if (rows[0].passwordless == 1)
                        sendPasswordlessSMS(rows[0].phone, uid, token);
                    // Send via email
                    if (rows[0].passwordless == 2)
                        sendPasswordlessEmail(req.params.email, uid, token);
                        
                    res.json({
                        error: false,
                        message: "Passwordless login link sent. It will expire in 10 minutes.",
                        passwordless: rows[0].passwordless
                    });
                });
            });
        });
    });

}