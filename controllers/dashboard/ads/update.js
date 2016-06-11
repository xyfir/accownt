const request = require("request");
const config = require("../../../config");
const db = require("../../../lib/db");

/*
    PUT api/dashboard/ads
    REQUIRED
        categories: string, keywords: string,
        age: number, gender: number
    RETURN
        { error: bool, message: string }
*/
module.exports = function(req, res) {
    let info = {};
    
    if (req.body.categories != "") info.categories = req.body.categories;
    if (req.body.keywords != "") info.keywords = req.body.keywords;
    if (req.body.gender != 0) info.gender = req.body.gender;
    if (req.body.age != 0) info.age = req.body.age;
    info = JSON.stringify(info);

    if (info == "{}") info = "";

    if (info.length > 800) {
        res.json({error: true, message: "Too many keywords and/or categories provided"});
        return;
    }
    
    db(function(cn) {
        // Grab XADID
        cn.query("SELECT xad_id FROM users WHERE id = ?", [req.session.uid], (err, rows) => {
            if (err || !rows.length) {
                res.json({error: true, message: "An unknown error occured"});
                return;
            }
            
            // Attempt to update XAD Profile
            request({
                url: config.addresses.xads + "api/xad-id/" + req.session.uid + "/" + rows[0].xad_id,
                form: {
                    secret: config.keys.xadid,
                    info: info
                },
                method: "PUT"
            }, (err, response, body) => {
                if (err)
                    res.json({error: true, message: "Could not reach Xyfir Ads to update your profile"});
                else
                    res.json(JSON.parse(body));
            });
        });
    });

}