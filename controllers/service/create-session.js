const generateToken = require('lib/tokens/generate');
const mysql = require('lib/mysql');

const config = require('config');

/*
  POST api/service/:service/session
  RETURNED
    { redirect: string }
  DESCRIPTION
    Generates an authentication token for a service linked to the user's 
    account and returns a url to redirect the client to.
*/
module.exports = async function(req, res) {
  const db = new mysql();

  try {
    // Generate an auth token for uid with service
    const { token, xid } = await generateToken({
      user: req.session.uid,
      service: req.params.service,
      type: 1
    });

    await db.getConnection();

    // Get service's address to redirect to
    const sql = `
      SELECT url_login AS url FROM services WHERE id = ?
    `,
      vars = [req.params.service],
      rows = await db.query(sql, vars);

    db.release();

    if (!rows.length) throw 'Unknown error';

    res.json({ redirect: `${rows[0].url}?auth=${token}&xid=${xid}` });
  } catch (err) {
    db.release();
    res.json({ redirect: config.addresses.xacc });
  }
};
