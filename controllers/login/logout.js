/*
    GET api/login/logout
    RETURN
        { error: boolean }
    DESCRIPTION
        Destroy user's session
*/
module.exports = function(req, res) {

    req.session.destroy(err => {
        res.json({ error: !!err });
    });

}