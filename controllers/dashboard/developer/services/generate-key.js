const randomstring = require('randomstring');
const db = require('lib/db');

/*
	POST api/dashboard/developer/services/:id/key
	RETURNED
		{ key?: string }
	DESCRIPTION
		Generate a new service key for service
*/
module.exports = function(req, res) {
  const key = randomstring.generate(128);

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
          'INSERT INTO service_keys (service_id, service_key) VALUES (?, ?)';
        vars = [req.params.id, key];

        cn.query(sql, vars, (err, result) => {
          cn.release();

          if (err || !result.affectedRows) res.status(400).json({});
          else res.status(200).json({ key });
        });
      }
    })
  );
};
