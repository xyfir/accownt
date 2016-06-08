const bcrypt = require("bcrypt");
const db = require("../../lib/db");

/*
    POST api/login
    REQUIRED
        email: string, password: string
    RETURN
        {
            error: bool, message?: string, loggedIn?: bool,
            redirect?: string, uid?: number, auth?: string,
            security?: { ** }
        }
*/
module.exports = function(req, res) {
		
    // Check for required fields
    if (!req.body.email || !req.body.password) {
        res.json({error: true, message: "Required field(s) empty"});
        return;
    }
    
    db(cn => {
        cn.query("SELECT id, password, verified FROM users WHERE email = ?", [req.body.email], (err, rows) => {
            
            // Check if user exists
            if (rows.length == 0) {
                res.json({error: true, message: "Could not find a user with that email / password"});
                return;
            }
            
            // Verify password
            bcrypt.compare(req.body.password, rows[0].password, (err, match) => {
                
                // Password is incorrect
                if (!match) {
                    res.json({error: true, message: "Could not find a user with that email / password"});
                    return;
                }
                
                const uid = rows[0].id;
                
                // Check if account"s email is verified
                if (rows[0].verified == 0) {
                    require("../../lib/email/sendVerification")(uid, req.body.email);
                    res.json({
                        error: true,
                        message: "You cannot login until you've verified your email. A new verification link has been sent to your email."
                    });
                    return;
                }
                
                // Check for extra security required
                cn.query("SELECT * FROM security WHERE user_id = ?", [uid], (err, rows) => {
                    
                    cn.release();
                    
                    require("../../lib/security/initiate")(uid, req, rows[0], security => {
                        if (security.noSecurity) {
                            // User has no extra security measures
                            // Login user
                            require("../../lib/login/doLogin")(req, uid);
                            res.json({error: false, loggedIn: true, redirect: req.session.redirect ? req.session.redirect : "" });
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
                                    uid: uid,
                                    auth: ""
                                };
                                
                                // Generate auth token
                                require("../../lib/auth/generateToken")([uid], token => {
                                    response.auth = token;
                                    res.json(response);
                                });
                            }
                        }
                    });
                });
            });
        });
    });

}