const MySQL = require('lib/mysql');

/*
  GET /api/dashboard/user/tokens
  RETURN
    {
      tokens: [{
        service_id: number, token: string, created: date-string,
        expires: date-string, last_use: date-string
      }]
    }
*/
module.exports = async function(req, res) {
  const db = new MySQL();
  try {
    const rows = await db.query(
      `SELECT * FROM access_tokens WHERE user_id = ?`,
      [req.session.uid]
    );
    res.status(200).json({ tokens: rows });
  } catch (err) {
    res.status(400).json({ message: err });
  }
  db.release();
};
