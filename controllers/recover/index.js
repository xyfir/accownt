const validateToken = require("lib/tokens/validate");

/*
    GET api/recover/:uid/:auth
    DESCRIPTION
        If recovery link is valid, log in user and set session.recovered = true
*/
module.exports = function(req, res) {
    
    validateToken({
        user: req.params.uid, token: req.params.auth
    }, isValid => {
        if (isValid) {
            // Set account_recovery session variable to true
            // When user logs in they can then change password without current
            req.session.recovered = true;
            req.session.uid = req.params.uid;

            res.redirect(req.session.redirect ? req.session.redirect : "/app/#/dashboard");
        }
        else {
            res.redirect("/app/#/login");
        }
    });
	
};