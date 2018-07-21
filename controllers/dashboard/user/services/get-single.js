const mysql = require('lib/mysql');

/*
  GET api/dashboard/user/services/:service
  RETURN
    {
      error: bool, message?: string,
      service?: {
        name: string, description: string, address: string,
        info: { requested: object, provided: object }
      }
    }
  DESCRIPTION
    Return a service's info and user-provided data to the service
*/
module.exports = async function(req, res) {
  const db = new mysql();

  try {
    await db.getConnection();

    let sql = `
      SELECT name, description, url_main AS address, info
      FROM services WHERE id = ?
    `,
      vars = [req.params.service],
      rows = await db.query(sql, vars);

    if (!rows.length) throw 'Could not find service';

    const service = rows[0];
    service.info = {
      requested: JSON.parse(service.info),
      provided: {}
    };

    (sql = `
      SELECT info FROM linked_services
      WHERE user_id = ? AND service_id = ?
    `),
      (vars = [req.session.uid, req.params.service]),
      (rows = await db.query(sql, vars));

    db.release();

    if (!rows.length) throw 'Account is not linked to service';

    service.info.provided = JSON.parse(rows[0].info);
    res.status(200).json({ service });
  } catch (err) {
    db.release();
    res.status(400).json({ message: err });
  }
};
