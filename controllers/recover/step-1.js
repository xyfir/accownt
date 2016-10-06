const generateToken = require("lib/tokens/generate");
const db = require("lib/db");

/*
    POST api/recover
    REQUIRED
        email: string
    RETURN
        {
            error: bool, message?: string, uid?: number,
            auth?: string, security?: { ** }
        }
*/
module.exports = function(req, res) {
    
    db(cn => {
        cn.query("SELECT id FROM users WHERE email = ? AND verified = ?", [req.body.email, 1], (err, rows) => {
            if (rows.length == 0) {
                cn.release();
                res.json({error: true, message: "An unknown error occured."});
                return;
            }
            
            const uid = rows[0].id;
            
            cn.query("SELECT phone, codes, addresses FROM security WHERE user_id = ?", [uid], (err, rows) => {
                cn.release();
                
                require("../../lib/security/initiate")(uid, req, rows[0], security => {
                    if (security.noSecurity) {
                        // User has no extra security measures
                        // Send account recovery email
                        require("../../lib/email/sendRecovery")(uid, req.body.email)
                        res.json({error: false, message: "An account recovery link has been sent to your email."});
                    }
                    else {
                        if (security.error) {
                            res.json(security); //{error,message}
                        }
                        else {
                            // Send security object back to client
                            let response = {
                                security: security,
                                error: false,
                                message: "",
                                email: req.body.email,
                                uid: uid,
                                auth: ""
                            };
                            
                            // Generate auth token
                            generateToken({
                                user: uid, type: 1
                            }, token => {
                                response.auth = token;
                                res.json(response);
                            });
                        }
                    }
                });
            });
        });
    });

}