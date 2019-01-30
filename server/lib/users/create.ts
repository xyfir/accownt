const request = require('superagent');

const config = require('config');

/**
 * Create a new user account, create row in `security` table.
 * @async
 * @param {object} db - Connected instance of `lib/mysql`.
 * @param {object} insert - Data inserted into the new `users` table row.
 * @returns {number} The id of the newly created user.
 */
module.exports = async function(db, insert) {
  let uid;

  try {
    // Create user's account
    let result = await db.query('INSERT INTO users SET ?', insert);

    if (!result.insertId) throw 'Could not create account';

    uid = result.insertId;

    // Create row in security table with user's id
    result = await db.query('INSERT INTO security SET ?', {
      user_id: uid,
      passwordless: 2
    });

    if (!result.affectedRows) throw 'Could not create security row';
  } catch (err) {
    await db.query('DELETE FROM users WHERE id = ?', [uid]);

    throw err;
  }

  return uid;
};
