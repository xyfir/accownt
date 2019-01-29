const request = require('superagent');
const mysql = require('lib/mysql');

/*
  DELETE /api/user/services/:service
  RETURN
    { message: string }
*/
module.exports = async function(req, res) {
  const db = new mysql();

  try {
    await db.getConnection();

    // Get data to send to the service's url_unlink
    let sql = `
      SELECT (
        SELECT xyfir_id FROM linked_services
        WHERE user_id = ? AND service_id = ?
      ) AS xid, (
        SELECT url_unlink AS url FROM services WHERE id = ?
      ) AS url, (
        SELECT service_key FROM service_keys WHERE service_id = ? LIMIT 1
      ) AS serviceKey
    `,
      vars = [
        req.session.uid,
        req.params.service,
        req.params.service,
        req.params.service
      ];

    const rows = await db.query(sql, vars);

    if (!rows[0].xid) throw 'Account is not linked to service';

    // Unlink the service from the user's account
    (sql = `
      DELETE FROM linked_services WHERE user_id = ? AND service_id = ?
    `),
      (vars = [req.session.uid, req.params.service]);

    const result = await db.query(sql, vars);

    db.release();

    if (!result.affectedRows) throw 'Could not unlink service from account';

    // Notify service that user unlinked their account
    if (rows[0].url) {
      await request.delete(rows[0].url).send({
        xid: rows[0].xid,
        key: rows[0].serviceKey
      });
    }

    res.status(200).json({});
  } catch (err) {
    db.release();
    res.status(400).json({ message: err });
  }
};
