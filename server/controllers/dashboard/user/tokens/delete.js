const mysql = require('lib/mysql');

/*
  DELETE /api/dashboard/user/tokens
  REQUIRED
    service: number, token: string
    OR
    all: boolean
  DESCRIPTION
    Delete a single, or all access tokens
*/

module.exports = async function(req, res) {
  const db = new mysql();

  try {
    await db.getConnection();

    let sql, vars;

    if (req.body.all) {
      (sql = `
        DELETE FROM access_tokens WHERE user_id = ?
      `),
        (vars = [req.session.uid]);
    } else {
      (sql = `
        DELETE FROM access_tokens
        WHERE user_id = ? AND service_id = ? AND token = ?
      `),
        (vars = [req.session.uid, req.body.service, req.body.token]);
    }

    const result = await db.query(sql, vars);
    db.release();

    res.status(200).json({});
  } catch (err) {
    db.release();
    res.status(400).json({});
  }
};
