const request = require('superagent');

const config = require('config');

/**
 * Create a new user account, generate xadid, create row in `security` table.
 * @async
 * @param {object} db - Connected instance of `lib/mysql`.
 * @param {object} insert - Data inserted into the new `users` table row.
 * @returns {number} The id of the newly created user.
 */
module.exports = async function(db, insert) {

  let uid;

  try {
    // Create user's account
    let result = await db.query(
      'INSERT INTO users SET ?', insert
    );

    if (!result.insertId) throw 'Could not create account';

    uid = result.insertId;

    // Generate xads id from xyAds
    const xads = await request
      .post(config.addresses.xads + 'api/xad-id/' + uid)
      .send({ secret: config.keys.xadid });
    
    if (xads.body.error) throw 'Could not generate id from xyAds';

    // Set xad_id in users table
    result = await db.query(
      'UPDATE users SET xad_id = ? WHERE id = ?',
      [xads.body.xadid, uid]
    );

    if (!result.affectedRows) throw 'Could not set xad_id';

    // Create row in security table with user's id
    result = await db.query(
      'INSERT INTO security SET ?',
      { user_id: uid }
    );

    if (!result.affectedRows) throw 'Could not create security row';
  }
  catch (err) {
    await db.query(
      'DELETE FROM users WHERE id = ?',
      [uid]
    );
    
    throw err;
  }

  return uid;

}