const db = require('lib/db');

/*
    GET api/dashboard/user/tokens
    RETURN
        { tokens: [{
            service_id: number, token: string, created: date-string,
            expires: date-string, last_use: date-string
        }] }
    DESCRIPTION
        Return all access tokens
*/

module.exports = function(req, res) {
  let sql = `
        SELECT * FROM access_tokens WHERE user_id = ?
    `;

  db(cn =>
    cn.query(sql, [req.session.uid], (err, rows) => {
      cn.release();
      res.status(200).json({ tokens: err ? [] : rows });
    })
  );
};
