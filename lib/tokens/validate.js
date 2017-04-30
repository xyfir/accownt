const mysql = require('lib/mysql');

/**
 * Validates an access or authentication token.
 * @async
 * @module lib/tokens/validate
 * @param {object} data
 * @param {function} [fn] - Callback function that resolves to boolean for if 
 * the token was valid.
 * @returns {undefined|boolean} Returns a boolean for if the token was valid.
 */
module.exports = async function(data, fn) {
  
  const db = new mysql();
  let sql = '', vars = [], rows = [], isValid = false;

  try {
    await db.getConnection();

    // Validate authentication token
    if (data.token.substr(0, 1) == 1) {
      // Validate auth token in security table
      if (!data.service) {
        sql = `
          SELECT auth_token FROM security
          WHERE user_id = ? AND auth_token = ? AND NOW() < auth_expire
        `,
        vars = [
          data.user, data.token
        ],
        rows = await db.query(sql, vars),
        isValid = !!rows.length;
      }
      // Validate auth token in linked_services table
      else {
        sql = `
          SELECT auth_token FROM linked_services
          WHERE
            user_id = ? AND service_id = ? AND auth_token = ?
            AND NOW() < auth_expire
        `,
        vars = [
          data.user, data.service, data.token
        ],
        rows = await db.query(sql, vars),
        isValid = !!rows.length;
      }
    }
    // Validate access token
    else if (data.token.substr(0, 1) == 2) {
      sql = `
        SELECT token FROM access_tokens
        WHERE
          user_id = ? AND service_id = ? AND token = ?
          AND NOW() < expires
      `,
      vars = [
        data.user, data.service, data.token
      ],
      rows = await db.query(sql, vars);

      if (!rows.length) throw 'Invalid token';
      
      // No error, update token's expires and last_use values
      sql = `
        UPDATE access_tokens SET
          last_use = NOW(), expires = DATE_ADD(NOW(), INTERVAL 7 DAY)
        WHERE user_id = ? AND service_id = ? AND token = ?
      `,
      vars = [
        data.user, data.service, data.token
      ],
      isValid = true;

      await db.query(sql, vars);
      db.release();
    }

    if (fn) fn(isValid); else return isValid;
  }
  catch (err) {
    if (fn) fn(false); else return false;
  }

};