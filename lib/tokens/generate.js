const rstring = require('randomstring');
const MySQL = require('lib/mysql');
const uuid = require('uuid/v4');

/**
 * @typedef {object} GenerateTokenOptions
 * @prop {number} type - `1` == auth token, `2` == access token
 * @prop {number} user
 * @prop {number} [service]
 */
/**
 * @typedef {object} GenerateTokenReturn
 * @prop {string} [id]
 * @prop {string} [xid]
 * @prop {string} token
 */
/**
 * Generate an access or authentication token.
 * @async
 * @param {GenerateTokenOptions} data
 * @return {string|GenerateTokenReturn}
 */
module.exports = async function(data) {

  // Generate random token
  const token = data.type + rstring.generate(127), db = new MySQL;

  try {
    await db.getConnection();

    let sql = '', vars = [];

    // Generate authentication token
    if (data.type == 1) {
      // Generate for security table
      if (!data.service) {
        const id = uuid();

        // Save to security
        sql = `
          UPDATE security SET
            auth_id = ?, auth_token = ?, auth_verified = 0,
            auth_expire = DATE_ADD(NOW(), INTERVAL 10 MINUTE)
          WHERE user_id = ?
        `,
        vars = [
          id, token, data.user
        ];
        
        await db.query(sql, vars);
        return { id, token };
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

        return { token, xid: rows[0].xyfir_id };
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

      return token;
    }
  }
  catch (err) {
    return '';
  }

};