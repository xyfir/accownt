const db = require('lib/db');

/*
    POST api/affiliate/purchase
    REQUIRED
        {
            service: number, serviceKey: string, promoCode: string,
            amount: number
        }
    RETURN
        { message?: string }
    DESCRIPTION
        Increments an affiliate campaign's purchases and earnings
*/
module.exports = function(req, res) {
  let sql = `
        SELECT (
            SELECT COUNT(*) FROM affiliate_promotions
            WHERE service_id = ? AND id IN (
                SELECT promo_id FROM affiliate_campaigns WHERE code = ?
            )
        ) as valid_code, (
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
      else if (!rows[0].valid_code) error = 'Invalid promotion';
      else if (!rows[0].valid_service) error = 'Invalid service / key';

      if (error) {
        cn.release();
        res.status(400).json({ message: error });
      } else {
        res.status(200).json({});

        (sql = `
                UPDATE affiliate_campaigns SET
                    purchases = purchases + 1, earnings = earnings + ?
                WHERE code = ?
            `),
          (vars = [+req.body.amount * 0.1, req.body.promoCode]);

        cn.query(sql, vars, (err, result) => cn.release());
      }
    })
  );
};
