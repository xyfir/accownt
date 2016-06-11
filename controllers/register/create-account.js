const request = require("request");
const config = require("../../config");
const bcrypt = require("bcrypt");
const db = require("../../lib/db"); 

/*
    POST api/register
    REQUIRED
        email: string, password: string
    RETURN
        { error: bool, message: string }
*/
module.exports = function(req, res) {

    // Check for required fields
    if (!req.body.email || !req.body.password) {
        res.json({error: true, message: "Required field(s) empty."});
        return;
    }
    
    // Attempt to register user
    db(cn => {
        cn.query("SELECT id FROM users WHERE email = ? AND verified = ?", [req.body.email, 1], (err, rows) => {
            
            // Email already linked to account
            if (rows.length > 0) {
                cn.release();
                res.json({error: true, message: "Email is already linked to an account."});
                return;
            }
            
            // Hash password with bcrypt + random salt
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                
                let data = {
                    email: req.body.email,
                    password: hash,
                    verified: 0
                };
                
                // Create user"s account
                cn.query("INSERT INTO users SET ?", data, (err, result) => {
                    // Generate XADID from Xyfir Ads
                    request({
                        url: config.addresses.xads + "api/xad-id/" + result.insertId,
                        form: {
                            secret: config.keys.xadid
                        }
                    }, (err, response, body) => {
                        let error = false;
                        
                        if (err) {
                            error = true;
                        }
                        else {
                            body = JSON.parse(body);
                            if (body.error) error = true;
                        }
                        
                        // Delete user and respond with error
                        if (error) {
                            cn.query("DELETE FROM users WHERE id = ?", [result.insertId], (err, result) => {
                                cn.release();
                                res.json({error: true, message: "Unknown error occured"});
                            });
                        }
                        // Set xadid
                        else {
                            cn.query(
                            "UPDATE users SET xad_id = ? WHERE id = ?",
                            [body.xadid, result.insertId],
                            (err, result) => {
                                // Send email verification email
                                require("../../lib/email/sendVerification")(result.insertId, req.body.email);
                                
                                res.json({error: false, message: ""});
                                
                                // Create row in security table with user"s id
                                const data = {
                                    user_id: result.insertId,
                                };
                                cn.query("INSERT INTO security SET ?", data, () => cn.release());
                            });
                        }
                    });
                });
            });
        });
    });

}