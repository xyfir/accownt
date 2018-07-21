const db = require('lib/db');

/*
	DELETE /api/dashboard/developer/services/:id/key
  REQUIRED
    key: string
*/
module.exports = function(req, res) {
  let sql = `
        SELECT * FROM services WHERE id = ? AND owner = ?
    `,
    vars = [req.params.id, req.session.uid];

  db(cn =>
    cn.query(sql, vars, (err, rows) => {
      if (err || !rows.length) {
        cn.release();
        res.status(400).json({});
      } else {
        sql =
          'DELETE FROM service_keys WHERE service_id = ? AND service_key = ?';
        vars = [req.params.id, req.body.key];

        cn.query(sql, vars, (err, result) => {
          cn.release();
          res.status(200).json({ error: !!err });
        });
      }
    })
  );
};
