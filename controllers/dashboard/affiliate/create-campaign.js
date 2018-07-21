const db = require('lib/db');

/*
    POST /api/dashboard/affiliate
    REQUIRED
        code: string, promo: number
    RETURN
        { message: string }
    DESCRIPTION
        Create an affiliate campaign for an affiliate promotion
*/
module.exports = function(req, res) {
  let sql = `
        SELECT (
            SELECT COUNT(*) FROM affiliate_campaigns WHERE code = ?
        ) as code_exists, (
            SELECT COUNT(*) FROM users WHERE id = ? AND affiliate = 1
        ) as is_affiliate, (
            SELECT COUNT(*) FROM affiliate_campaigns
            WHERE user_id = ? AND promo_id = ?
        ) as campaign_exists, (
            SELECT COUNT(*) FROM affiliate_promotions WHERE id = ?
        ) as promo_exists
    `,
    vars = [
      req.body.code,
      req.session.uid,
      req.session.uid,
      req.body.promo,
      req.body.promo
    ];

  db(cn =>
    cn.query(sql, vars, (err, rows) => {
      let error = '';

      if (err) error = 'An unknown error occured';
      else if (rows[0].code_exists) error = 'Promo code already in use';
      else if (!rows[0].is_affiliate) error = 'You are not an affiliate';
      else if (rows[0].campaign_exists)
        error = 'You already have a campaign with this promotion';
      else if (!rows[0].promo_exists) error = 'Invalid promotion';
      else if (!/^[A-Z0-9]{4,10}$/.test(req.body.code))
        error = 'Invalid code length / characters';

      if (error) {
        cn.release();
        res.status(400).json({ message: error });
      } else {
        let sql = `
                INSERT INTO affiliate_campaigns (user_id, promo_id, code)
                VALUES (?, ?, ?)
            `,
          vars = [req.session.uid, req.body.promo, req.body.code];

        cn.query(sql, vars, (err, result) => {
          cn.release();

          if (err || !result.affectedRows)
            res.status(400).json({ message: 'An unknown error occured' });
          else res.status(200).json({ message: 'Campaign created' });
        });
      }
    })
  );
};
