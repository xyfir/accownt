const mysql = require('lib/mysql');

/*
  GET /api/dashboard/user/services/:service
  RETURN
    {
      message?: string,
      service?: {
        name: string, description: string, address: string
      }
    }
*/
module.exports = async function(req, res) {
  const db = new mysql();

  try {
    await db.getConnection();

    let sql = `
      SELECT name, description, url_main AS address
      FROM services WHERE id = ?
    `,
      vars = [req.params.service],
      rows = await db.query(sql, vars);
    db.release();

    if (!rows.length) throw 'Could not find service';

    res.status(200).json({ service: rows[0] });
  } catch (err) {
    db.release();
    res.status(400).json({ message: err });
  }
};
