const rstring = require('randomstring');
const mysql = require('lib/mysql');

/**
 * Generate an access or authentication token.
 * @async
 * @module lib/tokens/generate
 * @param {object} data
 * @param {function} [fn] - Callback function that resolves either to the 
 * token string or an object containing `token` and `xid` string properties.
 * @returns {undefined|string|object} Returns the token string or an object 
 * containing `token` and `xid` string properties if `fn` is not present.
 */
module.exports = async function(data, fn) {
  
  // Generate random token
  const token = data.type + rstring.generate(127), db = new mysql();
  
  try {
    await db.getConnection();

    // Save code to database
    let sql = '', vars = [];

    // Generate authentication token
    if (data.type == 1) {
      // Generate for security table
      if (!data.service) {
        // Save to security
        sql = `
          UPDATE security SET
            auth_token = ?, auth_expire = DATE_ADD(NOW(), INTERVAL 10 MINUTE)
          WHERE user_id = ?
        `,
        vars = [
          token, data.user
        ];
        
        await db.query(sql, vars);
        if (fn) fn(token); else return token;
      }
      // Generate for linked_services table
      else {
        // Save to linked_services
        sql = `
          UPDATE linked_services SET
            auth_token = ?, auth_expire = DATE_ADD(NOW(), INTERVAL 10 MINUTE)
          WHERE user_id = ? AND service_id = ?
        `,
        vars = [
          token, data.user, data.service
        ];

        await db.query(sql, vars);
        
        // Get XID
        sql = `
          SELECT xyfir_id FROM linked_services
          WHERE user_id = ? AND service_id = ?
        `,
        vars = [
          data.user, data.service
        ];

        const rows = await db.query(sql, vars);
        if (fn) fn(token, rows[0].xyfir_id);
        else return { token, xid: rows[0].xyfir_id };
      }
    }
    // Generate access token
    else if (data.type == 2) {
      sql = `
        INSERT INTO access_tokens
          (user_id, service_id, token, created, expires, last_use)
        VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), NOW())
      `,
      vars = [
        data.user, data.service, token
      ];

      await db.query(sql, vars);
      if (fn) fn(token); else return token;
    }
  }
  catch (err) {
    if (fn) fn(''); else return '';
  }

};