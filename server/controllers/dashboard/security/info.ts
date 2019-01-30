const mysql = require('lib/mysql');

/*
  GET /api/user/security
  RETURN
    { passwordless: number, appOtp: boolean }
*/
module.exports = async function(req, res) {
  const db = new mysql();

  try {
    await db.getConnection();

    const sql = `
      SELECT passwordless, IF(LENGTH(otp_secret) > 0, 1, 0) AS appOtp
      FROM security WHERE user_id = ?
    `,
      vars = new Array(2).fill(req.session.uid),
      rows = await db.query(sql, vars);
    db.release();

    (rows[0].appOtp = !!rows[0].appOtp), (rows[0].error = false);

    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(400).json({});
  }
};
