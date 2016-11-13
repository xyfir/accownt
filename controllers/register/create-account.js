const sendVerificationEmail = require("lib/email/send-verification");
const request = require("request");
const config = require("config");
const bcrypt = require("bcrypt");
const db = require("lib/db"); 

/*
    POST api/register
    REQUIRED
        email: string, password: string, recaptcha: string
    RETURN
        { error: bool, message: string }
*/
module.exports = function(req, res) {

    // Check for required fields
    if (!req.body.email || !req.body.password || !req.body.recaptcha) {
        res.json({ error: true, message: "Required field(s) empty." });
        return;
    }

    // Check if recaptcha response is valid
    request.post({
        url: "https://www.google.com/recaptcha/api/siteverify",
        form: {
            secret: config.keys.recaptcha,
            response: req.body.recaptcha,
            remoteip: req.ip
        }
    }, (e, r, body) => {
        if (e || !JSON.parse(body).success) {
            res.json({ error: true, message: "Invalid captcha" });
            return;
        }
        
        let sql = `
            SELECT id FROM users WHERE email = ? AND verified = ?
        `, vars = [
            req.body.email, 1
        ];

        // Attempt to register user
        db(cn => cn.query(sql, vars, (err, rows) => {
            // Email already linked to account
            if (rows.length > 0) {
                cn.release();
                res.json({
                    error: true, message: "Email is already linked to an account."
                }); return;
            }
            
            // Hash password with bcrypt + random salt
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                // Create user's account
                sql = "INSERT INTO users SET ?";
                let data = {
                    email: req.body.email,
                    password: hash,
                    verified: 0
                };
                
                cn.query(sql, data, (err, result) => {
                    if (err || !result.insertId) {
                        cn.release();
                        res.json({
                            error: true, message: "Unknown error occured"
                        }); return;
                    }

                    const uid = result.insertId;

                    // Generate XADID from Xyfir Ads
                    request.post({
                        url: config.addresses.xads + "api/xad-id/" + uid,
                        form: { secret: config.keys.xadid }
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
                            sql = "DELETE FROM users WHERE id = ?";
                            cn.query(sql, [uid], (err, result) => {
                                cn.release();
                                res.json({
                                    error: true, message: "Unknown error occured"
                                });
                            });
                        }
                        // Set xadid
                        else {
                            sql = `
                                UPDATE users SET xad_id = ? WHERE id = ?
                            `, vars = [
                                body.xadid, uid
                            ];

                            cn.query(sql, vars, (err, result) => {
                                res.json({ error: false, message: "" });

                                // Create row in security table with user's id
                                cn.query("INSERT INTO security SET ?", {
                                    user_id: uid
                                }, (err, result) => {
                                    cn.release();

                                    // Send email verification email
                                    // !! Requires row in security table
                                    sendVerificationEmail(uid, req.body.email);
                                });
                            });
                        }
                    });
                });
            });
        }));
    });

}