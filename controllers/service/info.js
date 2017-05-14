const mysql = require('lib/mysql');

const config = require('config');

/*
  GET api/service/:service
  RETURNED
    { error: bool, message?: string, service?: {}, profiles?: [] }
  DESCRIPTION
    Returns to user when linking service to account
*/
module.exports = async function(req, res) {

  const db = new mysql();

  try {
    if (!req.session.uid) {
      req.session.redirect =
        `${config.addresses.xacc}#/login/service/${req.params.service}`;
      throw 'Not logged in';
    }

    await db.getConnection();

    // Get service's info
    let sql = `
      SELECT name, description, info FROM services WHERE id = ?
    `,
    vars = [
      req.params.service
    ],
    rows = await db.query(sql, vars);

    if (rows.length == 0) throw 'Service does not exist';
    
    const data = {
      name: rows[0].name,
      description: rows[0].description,
      requested: JSON.parse(rows[0].info)
    };

    // Check if user is already linked to service
    sql = `
      SELECT xyfir_id FROM linked_services
      WHERE user_id = ? AND service_id = ?
    `,
    vars = [
      req.session.uid, req.params.service
    ],
    rows = await db.query(sql, vars);
    
    if (rows.length > 0) throw 'Service is already linked to account';

    // Grab user's profiles     
    sql = `
      SELECT profile_id, name FROM profiles WHERE user_id = ?
    `,
    vars = [
      req.session.uid
    ],
    rows = await db.query(sql, vars);

    db.release();

    res.json({
      error: false, service: data, profiles: rows
    });
  }
  catch (err) {
    db.release();
    res.json({ error: true, message: err });
  }

}