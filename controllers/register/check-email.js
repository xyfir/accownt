const mysql = require('lib/mysql');

/*
  GET api/register/email
  REQUIRED
    email: string
  RETURN
    { exists: boolean }
*/
module.exports = async function(req, res) {
  const db = new mysql();

  try {
    await db.getConnection();

    const sql = `
      SELECT id FROM users WHERE email = ? AND verified = ?
    `,
      vars = [req.query.email, 1],
      rows = await db.query(sql, vars);

    db.release();
    res.status(200).json({ exists: !!rows.length });
  } catch (e) {
    db.release();
    res.status(400).json({ exists: true });
  }
};
