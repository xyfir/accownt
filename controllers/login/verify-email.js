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
            require("lib/login/doLogin")(req, req.params.uid);
            
            // Set verified
            db(cn => {
                cn.query("UPDATE users SET verified = ? WHERE id = ?", [1, req.params.uid], (err, result) => {
                    cn.release();
                    
                    res.redirect(req.session.redirect ? req.session.redirect : "/app/#/dashboard");
                });
            });
        }
        else {
            res.redirect("/app/#/login");
        }
    });

}