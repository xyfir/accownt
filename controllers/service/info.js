const mysql = require('lib/mysql');

const config = require('config');

/*
  GET api/service/:service
  RETURNED
    {
      error: bool, message?: string,
      service: null|Object({
        id: number, name: string, description: string, requested: object
      }),
      profiles?: [{
        id: number, name: string
      }]
    }
  DESCRIPTION
    Returns to user when linking service to account
*/
module.exports = async function(req, res) {

  const db = new mysql;
  let service = null;

  try {
    // Get service's info
    await db.getConnection();
    [service] = await db.query(`
      SELECT
        id, name, description, info AS requested, url_main AS url
      FROM services WHERE id = ?
    `, [
      req.params.service
    ]);

    if (!service) throw 'Service does not exist';

    service.requested = JSON.parse(service.requested);

    if (!req.session.uid) {
      req.session.redirect =
        `${config.addresses.xacc}#/login/service/${req.params.service}`;
      throw 'Not logged in';
    }

    // Check if user is already linked to service
    const rows = await db.query(`
      SELECT xyfir_id FROM linked_services
      WHERE user_id = ? AND service_id = ?
    `, [
      req.session.uid, req.params.service
    ]);
    
    if (rows.length) throw 'Service is already linked to account';

    // Grab user's profiles
    const profiles = await db.query(`
      SELECT id, name FROM profiles WHERE user_id = ?
    `, [
      req.session.uid
    ]);
    db.release();

    res.json({ error: false, service, profiles });
  }
  catch (err) {
    db.release();
    res.json({ error: true, message: err, service });
  }

}