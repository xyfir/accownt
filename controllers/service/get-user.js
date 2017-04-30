const validateToken = require('lib/tokens/validate');
const generateToken = require('lib/tokens/generate');
const mysql = require('lib/mysql');
  
/*
  GET api/service/:service/:key/:xid/:token
    - Old way, takes no query string variables
  GET api/service/:service/user
    - New way, takes key, xid, and token as query string variables
    REQUIRED
      key: string, xid: string, token: string
  RETURNS
    {
      error: boolean, message?: string,
      xadid?: string,
      accessToken?: string?
      fname, country, ...
    }
  DESCRIPTION
    Called by service upon successful login OR with access token to start new session
    Returns xadid and required/optional data provided by user
    Token can be authorization (starts with 1) or access token (starts with 2)
    Generates and returns an access token if token starts with 1
*/
module.exports = async function(req, res) {

  const db = new mysql();

  try {
    await db.getConnection();

    // Verify service exists and service key is valid
    let sql = `
      SELECT id FROM services WHERE id IN (
        SELECT service_id FROM service_keys
        WHERE service_id = ? AND service_key = ?
      )
    `,
    vars = [
      req.params.service, req.params.key || req.query.key
    ],
    rows = await db.query(sql, vars);

    if (!rows.length) throw 'Service id and key do not match';

    // Check if xid matches service
    sql = `
      SELECT user_id, info FROM linked_services
      WHERE service_id = ? AND xyfir_id = ?
    `,
    vars = [
      req.params.service, req.params.xid || req.query.xid
    ],
    rows = await db.query(sql, vars);

    if (!rows.length) throw 'Xyfir ID not linked to service';
      
    const uid = rows[0].user_id, token = req.params.token || req.query.token;

    // Check if authentication/access token is valid
    const isValid = await validateToken({
      user: uid, service: req.params.service, token
    });

    if (!isValid) throw 'Invalid token';
        
    // Grab info that user provided to service
    const data = JSON.parse(rows[0].info);

    // Get user's Xyfir Ads profile id
    // Generate access token if needed
    // Return info to user
    const finish = async data => {
      sql = `
        SELECT xad_id FROM users WHERE id = ?
      `,
      vars = [
        uid
      ],
      rows = await db.query(sql, vars);
      db.release();

      data.xadid = rows[0].xad_id;
      data.error = false;

      // Generate access token
      if (token.substr(0, 1) == 1) {
        data.accessToken = await generateToken({
          user: uid, service: req.params.service, type: 2
        });
      }
      
      res.json(data);
    };
    
    // Pull data for service from profile
    if (data.profile) {
      // Grab requested info from service
      sql = `
        SELECT info FROM services WHERE id = ?
      `,
      vars = [
        req.params.service
      ],
      rows = await db.query(sql, vars);

      const requested = JSON.parse(rows[0].info);
      
      sql = `
        SELECT * FROM profiles WHERE profile_id = ?
      `,
      vars = [
        data.profile
      ],
      rows = await db.query(sql, vars);
      
      // Grab data from profile
      const provided = {};
      
      // Loop through requested.required and add data
      Object.keys(requested.required).forEach(key =>
        // Copy profile's data to provided's data
        // required.name: provided.name = profile.name
        provided[key] = rows[0][key]
      );
      
      // Loop through requested.optional if optional and add data
      if (data.optional) {
        Object.keys(requested.optional).forEach(key => 
          // Copy profile's data to provided's data
          provided[key] = rows[0][key]
        );
      }
      
      finish(provided);
    }
    // User provided custom data for service
    else {
      finish(data);
    }
  }
  catch (err) {
    db.release();
    res.json({ error: true, message: err });
  }

}