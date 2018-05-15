const mysql = require('lib/mysql');

/*
  GET api/dashboard/user/services
  RETURN
    { services: [{
      id: number, name: string, description: string, address: string
    }] }
DESCRIPTION
    Return all linked services
*/
module.exports = async function(req, res) {
  const db = new mysql();

  try {
    await db.getConnection();

    const sql = `
      SELECT id, name, description, url_main AS address FROM services
      WHERE id IN (
        SELECT service_id FROM linked_services WHERE user_id = ?
      )
    `,
      vars = [req.session.uid],
      services = await db.query(sql, vars);

    res.json({ services });
  } catch (err) {
    db.release();
    res.json({ services: [] });
  }
};
