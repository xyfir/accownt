/*
    GET api/login/logout
    DESCRIPTION
        Destroy user's session
*/
module.exports = function(req, res) {

    req.session.destroy(err => {
        if (err)
            res.redirect("/app/#/dashboard");
        else
            res.redirect("/app/#/login");
    });

}