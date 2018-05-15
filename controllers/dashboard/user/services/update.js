const validateData = require('lib/services/validate-data');
const request = require('superagent');
const mysql = require('lib/mysql');

/*
  PUT api/dashboard/user/services/:service
  RETURN
    { error: bool, message: string }
  DESCRIPTION
    Update the data that a user provides to a service
*/
module.exports = async function(req, res) {
  const db = new mysql();

  try {
    let { result, info } = await validateData(req);

    if (result != 'valid') throw result;

    await db.getConnection();

    let sql = `
      UPDATE linked_services SET info = ?
      WHERE user_id = ? AND service_id = ?
    `,
      vars = [JSON.stringify(info), req.session.uid, req.params.service];
    result = await db.query(sql, vars);

    if (!result.affectedRows) throw 'Could not update data';

    (sql = `
      SELECT (
        SELECT xyfir_id FROM linked_services
        WHERE user_id = ? AND service_id = ?
      ) AS xid, (
        SELECT url_update AS url FROM services WHERE id = ?
      ) AS url, (
        SELECT service_key FROM service_keys WHERE service_id = ? LIMIT 1
      ) AS serviceKey
    `),
      (vars = [
        req.session.uid,
        req.params.service,
        req.params.service,
        req.params.service
      ]);

    const rows = await db.query(sql, vars);

    // Notify service that user updated their account data
    if (rows[0].url) {
      await request.put(rows[0].url).send({
        xid: rows[0].xid,
        key: rows[0].serviceKey,
        user: JSON.stringify(info)
      });
    }

    db.release();
    res.json({ error: false, message: 'Service successfully updated' });
  } catch (err) {
    db.release();
    res.json({ error: true, message: err });
  }
};
