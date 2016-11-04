const db = require("lib/db");

/*
    DELETE api/dashboard/user/profiles/:profile
    RETURN
        { error: bool, message: string }
    DESCRIPTION
        Delete a profile
        Will not delete if profile is linked to a service
*/
module.exports = function(req, res) {
    
    // Get info object for all of user's linked services
    let sql = `
        SELECT info FROM linked_services WHERE user_id = ?
    `, vars = [
        req.session.uid
    ];

    db(cn => cn.query(sql, vars, (err, rows) => {
        // Check if profile is linked to a service
        let linked = !!rows.find(r => {
            return JSON.parse(r.info).profile == req.params.profile;
        });

        if (linked) {
            cn.release();
            res.json({
                error: true,
                message: "Cannot delete profiles that are linked to services"
            }); return;
        }

        // Delete profile
        sql = `
            DELETE FROM profiles WHERE profile_id = ? AND user_id = ?
        `, vars = [
            req.params.profile, req.session.uid
        ];

        cn.query(sql, vars, (err, result) => {
            cn.release();
            
            if (!err || !result.affectedRows)
                res.json({ error: false, message: "Profile deleted" });
            else
                res.json({ error: true, message: "An unknown error occured" });
        });
    }));

}