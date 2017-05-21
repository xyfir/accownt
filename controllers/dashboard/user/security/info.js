const mysql = require('lib/mysql');

/*
  GET api/dashboard/user/security
  RETURN
    {
      error: boolean,
      phone: string, codes: string, passwordless: number, appOtp: boolean
    }
*/
module.exports = async function(req, res) {

  const db = new mysql();

  try {
    await db.getConnection();

    const sql = `
      SELECT
        phone, codes, passwordless, IF(LENGTH(otp_secret) > 0, 1, 0) AS appOtp
      FROM security WHERE user_id = ?
    `,
    vars = [
      req.session.uid
    ],
    rows = await db.query(sql, vars);
    db.release();

    rows[0].appOtp = !!rows[0].appOtp;
    res.json(rows[0]);
  }
  catch (err) {
    res.json({ error: true });
  }

}