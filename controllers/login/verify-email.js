const validate = require("../../lib/auth/validateToken");
const db = require("../../lib/db");

/*
    GET api/login/verify-email/:uid/:auth
    DESCRIPTION
        Attempts to login user with :uid/:auth
*/
module.exports = function(req, res) {

    validate([req.params.uid], req.params.auth, isValid => {
        if (isValid) {
            require("../lib/login/doLogin")(req, req.params.uid);
            
            // Set verified
            require("../lib/db")(cn => {
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