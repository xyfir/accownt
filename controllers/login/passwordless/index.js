const validate = require("../../../lib/auth/validateToken");
const db = require("../../../lib/db");

/*
    GET api/login/passwordless/:uid/:auth
    DESCRIPTION
        Attempts to login user with :uid/:auth
*/
module.exports = function(req, res) {

    validate([req.params.uid], req.params.auth, isValid => {
        if (isValid) {
            req.session.uid = req.params.uid;
            res.redirect(req.session.redirect ? req.session.redirect : "/app/#/dashboard");
        }
        else {
            res.redirect("/app/#/login");
        }
    });

}