const request = require("request");
const config = require("../../../config");
const db = require("../../../lib/db");
	
/*
    GET api/dashboard/ads
    RETURN
        {info: string/json-string}
*/
module.exports = function(req, res) {
    
    db(cn => {
        cn.query("SELECT xad_id FROM users WHERE id = ?", [req.session.uid], (err, rows) => {
            cn.release();
            
            if (err || !rows.length) {
                res.json({info: ""});
                return;
            }
            
            request({
                url: config.addresses.xads + "api/xad-id/" + req.session.uid + "/" + rows[0].xad_id
                    + "?secret=" + config.keys.xadid,
            }, (err, response, body) => {
                if (err)
                    res.json({info: ""});
                else
                    res.json({info: JSON.parse(body).info});
            });
        });
    });

}