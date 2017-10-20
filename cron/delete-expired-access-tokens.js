const mysql = require('lib/mysql');

module.exports = async function() {

  const db = new mysql;

  try {
    await db.getConnection();
    await db.query('DELETE FROM access_tokens WHERE NOW() > expires');
    db.release();
  }
  catch (err) {
    db.release();
    console.error('cron/delete-expired-access-tokens', err);
  }

}