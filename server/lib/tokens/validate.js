const MySQL = require('lib/mysql');

/**
 * @typedef {object} ValidateTokenOptions
 * @prop {number} user
 * @prop {string} token
 * @prop {number} [service]
 */
/**
 * Validates an access or authentication token.
 * @async
 * @param {ValidateTokenOptions} data
 * @return {boolean} If the token is valid.
 */
module.exports = async function(data) {
  const db = new MySQL();
  let sql = '',
    vars = [],
    rows = [],
    result = {},
    isValid = false;

  try {
    await db.getConnection();

    // Validate authentication token
    if (data.token.substr(0, 1) == 1) {
      // Validate auth token in security table
      if (!data.service) {
        (sql = `
          UPDATE security SET auth_verified = 1
          WHERE user_id = ? AND auth_token = ? AND NOW() < auth_expire
        `),
          (vars = [data.user, data.token]),
          (result = await db.query(sql, vars)),
          (isValid = !!result.affectedRows);
      }
      // Validate auth token in linked_services table
      // Expire token immediately
      else {
        (sql = `
          UPDATE linked_services
          SET
            auth_expire = NOW()
          WHERE
            user_id = ? AND service_id = ? AND auth_token = ?
            AND NOW() < auth_expire
        `),
          (vars = [data.user, data.service, data.token]),
          (result = await db.query(sql, vars)),
          (isValid = !!result.affectedRows);
      }
    }
    // Validate access token
    else if (data.token.substr(0, 1) == 2) {
      (sql = `
        SELECT token FROM access_tokens
        WHERE
          user_id = ? AND service_id = ? AND token = ?
          AND NOW() < expires
      `),
        (vars = [data.user, data.service, data.token]),
        (rows = await db.query(sql, vars));

      if (!rows.length) throw 'Invalid token';

      // No error, update token's expires and last_use values
      (sql = `
        UPDATE access_tokens SET
          last_use = NOW(), expires = DATE_ADD(NOW(), INTERVAL 7 DAY)
        WHERE user_id = ? AND service_id = ? AND token = ?
      `),
        (vars = [data.user, data.service, data.token]),
        (isValid = true);

      await db.query(sql, vars);
      db.release();
    }

    return isValid;
  } catch (err) {
    return false;
  }
};
