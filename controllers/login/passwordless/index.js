const validateToken = require("lib/tokens/validate");
const db = require("lib/db");

/*
    GET api/login/passwordless/:uid/:auth
    DESCRIPTION
        Attempts to login user with :uid/:auth
*/
module.exports = function(req, res) {

    validateToken({
        user: req.params.uid, token: req.params.auth
    }, isValid => {
        if (isValid) {
            req.session.uid = req.params.uid;
            res.redirect(
                req.session.redirect
                ? req.session.redirect : "/app/#/dashboard/user"
            );
        }
        else {
            res.redirect("/app/#/login");
        }
    });

}