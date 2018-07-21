const db = require('lib/db');

/*
    POST /api/affiliate/signup
    REQUIRED
        { service: number, serviceKey: string, promoCode: string }
    RETURN
        { message?: string, promo?: number }
    DESCRIPTION
        Validates that a promo code exists and is linked to a valid campaign/promo
        Returns id for affiliate promotion linked to code if valid
        Increments campaign's signups
*/
module.exports = function(req, res) {
  let sql = `
        SELECT (
            SELECT id FROM affiliate_promotions
            WHERE service_id = ? AND id IN (
                SELECT promo_id FROM affiliate_campaigns WHERE code = ?
            )
        ) as promo_id, (
            SELECT COUNT(*) FROM services WHERE id IN (
                SELECT service_id FROM service_keys
                WHERE service_id = ? AND service_key = ?
            )
        ) as valid_service
    `,
    vars = [
      req.body.service,
      req.body.promoCode,
      req.body.service,
      req.body.serviceKey
    ];

  db(cn =>
    cn.query(sql, vars, (err, rows) => {
      let error = '';

      if (err) error = 'An unknown error occured';
      else if (!rows[0].promo_id) error = 'Invalid promotion';
      else if (!rows[0].valid_service) error = 'Invalid service / key';

      if (error) {
        cn.release();
        res.status(400).json({ message: error });
      } else {
        res.status(200).json({ promo: rows[0].promo_id });

        (sql = `
                UPDATE affiliate_campaigns SET signups = signups + 1
                WHERE code = ?
            `),
          (vars = [req.body.promoCode]);

        cn.query(sql, vars, (err, result) => cn.release());
      }
    })
  );
};
