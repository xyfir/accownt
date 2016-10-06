const db = require("lib/db");

/*
    DELETE api/dashboard/tokens
    REQUIRED
        service: number, token: string
    RETURN
        { error: boolean }
    DESCRIPTION
        Delete an access token
*/

module.exports = function(req, res) {

    let sql = `
        DELETE FROM access_tokens
        WHERE user_id = ? AND service_id = ? AND token = ?
    `, vars = [
        req.session.uid, req.body.service, req.body.token
    ];

    db(cn => cn.query(sql, vars, (err, result) => {
        cn.release();
        res.json({ error: !!err || !result.affectedRows });
    }));

}