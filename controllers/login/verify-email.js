const validateToken = require("lib/tokens/validate");
const db = require("lib/db");

/*
    GET api/login/verify-email/:uid/:auth
    DESCRIPTION
        Verify a users email if :uid/:auth are valid
*/
module.exports = function(req, res) {
    
    validateToken({
        user: req.params.uid, token: req.params.auth
    }, isValid => {
        
        if (isValid) {
            req.session.uid = req.params.uid;

            let sql = `
                UPDATE users SET verified = ? WHERE id = ?
            `, vars = [
                1, req.params.uid
            ];
            
            // Set verified
            db(cn => cn.query(sql, vars, (err, result) => {
                if (err || !result.affectedRows) {
                    cn.release();
                    res.redirect("/#/login");
                }
                else {
                    res.redirect(
                        req.session.redirect
                        ? req.session.redirect : "/#/dashboard/user"
                    );
                    req.session.redirect = "";

                    // Get user's email
                    sql = `
                        SELECT email FROM users WHERE id = ?
                    `, vars = [
                        req.session.uid
                    ];

                    cn.query(sql, vars, (err, rows) => {
                        // Delete unverified accounts with the same email
                        sql = `
                            DELETE FROM users WHERE email = ? AND verified = 0 
                        `, vars = [
                            rows[0].email
                        ];
                        cn.query(sql, (err, result) => cn.release());
                    });
                }
            }));
        }
        else {
            res.redirect("/#/login");
        }
    });

}