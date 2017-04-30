const generateToken = require('lib/tokens/generate');
const mysql = require('lib/mysql');

const config = require('config');

/*
  POST api/service/:service/session
  RETURNED
    { auth: string, xid: string, address: string }
  DESCRIPTION
    Returns user/service's Xyfir ID and session auth token
    Returns address for redirecting upon successful login to XAcc
*/
module.exports = async function(req, res) {

  const db = new mysql();

  try {
    // Generate an auth token for uid with service
    const { token, xid } = await generateToken({
      user: req.session.uid, service: req.params.service, type: 1
    });

    await db.getConnection();

    // Get service's address to redirect to
    const sql = `
      SELECT address FROM services WHERE id = ?
    `,
    vars = [
      req.params.service
    ],
    rows = await db.query(sql, vars);
    
    db.release();

    if (!rows.length) throw 'Unknown error';
    
    res.json({ auth: token, xid, address: rows[0].address });
  }
  catch (err) {
    db.release();
    res.json({ auth: '', xid: '', address: config.addresses.xacc });
  }

}