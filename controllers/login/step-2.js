const db = require("../../lib/db");

/*
    POST api/login/verify
    REQUIRED
        **
    RETURN
        { error: bool, loggedIn?: bool, redirect?: string }
*/
module.exports = function(req, res) {

    require("../../lib/security/validate")(req.body, response => {
        if (response.error) {
            res.json(response); // {error,message}
        }
        else {
            // Complete login process
            require("../../lib/login/doLogin")(req, req.body.uid);
            res.json({
                error: false, loggedIn: true,
                redirect: req.session.redirect ? req.session.redirect : ""
            });
            req.session.redirect = "";
        }
    });
    
}