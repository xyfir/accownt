const db = require("lib/db");

/*
    GET api/dashboard/affiliate
    RETURN
        { campaigns: [{
            code: string, signups: number, purchases: number,
            earnings: number, promo: {
                id: number, name: string, description: string
            }
        }] }
    DESCRIPTION
        Return full info for all affiliate campaigns and the linked promotions
*/
module.exports = function(req, res) {

    let sql = `
        SELECT * FROM affiliate_campaigns WHERE user_id = ?
    `, vars = [
        req.session.uid
    ];
    
    db(cn => cn.query(sql, vars, (err, campaigns) => {
        if (err || !campaigns.length) {
            cn.release();
            res.json({ campaigns: [] });
        }
        else {
            sql = `
                SELECT * FROM affiliate_promotions WHERE id IN (?)
            `, vars = [
                campaigns.map(c => c.promo_id)
            ];

            cn.query(sql, vars, (err, promos) => {
                cn.release();

                // Build output object
                let response = { campaigns: [] };

                response.campaigns = campaigns.map(c => {
                    let promo = {};

                    for (let p of promos) {
                        if (c.promo_id == p.id) {
                            promo = {
                                id: p.id, name: p.name,
                                description: p.description
                            }; break;
                        }
                    }

                    return {
                        code: c.code, signups: c.signups, purchases: c.purchases,
                        earnings: c.earnings, promo
                    };
                });

                res.json(response);
            });
        }
    }));

}