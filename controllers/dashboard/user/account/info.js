const db = require("lib/db");

/*
    GET api/dashboard/user/account
    RETURN
        {
            loggedIn: boolean,
            email?: string, recovered?: boolean, affiliate?: boolean
        }
*/
module.exports = function(req, res) {

    if (!req.session.uid) {
        res.json({ loggedIn: false });
        return;
    }

    let sql = `
        SELECT email, affiliate FROM users WHERE id = ?
    `;
    
    db(cn => cn.query(sql, [req.session.uid], (err, rows) => {
        cn.release();
        
        if (err || !rows.length) {
            res.json({ loggedIn: false });
        }
        else {
            res.json({
                email: rows[0].email, recovered: req.session.recovered,
                loggedIn: true, affiliate: rows[0].affiliate
            });
        }
    }));

}