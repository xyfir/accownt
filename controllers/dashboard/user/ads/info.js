const request = require("request");
const db = require("lib/db");

const config = require("config");
	
/*
    GET api/dashboard/user/ads
    RETURN
        { info: string|json-string }
*/
module.exports = function(req, res) {

    let sql = `
        SELECT xad_id FROM users WHERE id = ?
    `;
    
    db(cn => cn.query(sql, [req.session.uid], (err, rows) => {
        cn.release();
        
        if (err || !rows.length) {
            res.json({ info: "" });
            return;
        }
        
        request({
            url: config.addresses.xads + "api/xad-id/" + req.session.uid + "/" + rows[0].xad_id
                + "?secret=" + config.keys.xadid,
        }, (err, response, body) => {
            if (err)
                res.json({ info: "" });
            else
                res.json({ info: JSON.parse(body).info });
        });
    }));

}