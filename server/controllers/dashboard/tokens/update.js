const mysql = require('lib/mysql');

/*
  PUT /api/user/tokens
  REQUIRED
    service: number, token: string, name: string
  DESCRIPTION
    Updates an access token's name
*/

module.exports = async function(req, res) {
  const db = new mysql();

  try {
    await db.getConnection();

    const sql = `
      UPDATE access_tokens SET name = ?
      WHERE user_id = ? AND service_id = ? AND token = ?
    `,
      vars = [req.body.name, req.session.uid, req.body.service, req.body.token],
      result = await db.query(sql, vars);

    db.release();

    if (!result.affectedRows) throw 'Could not update token';

    res.status(200).json({});
  } catch (err) {
    db.release();
    res.status(400).json({});
  }
};
