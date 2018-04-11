const MySQL = require('lib/mysql');

(async function() {

  const db = new MySQL;
  const rows = await db.getConnection(
    `SELECT info, xyfir_id FROM linked_services WHERE info LIKE '%"profile"%';`
  );
  for (let row of rows) {
    const info = JSON.parse(row.info);
    const [{email}] = await db.query(
      'SELECT email FROM profiles WHERE id = ?', [info.email]
    );
    await db.query(
      'UPDATE linked_services SET info = ? WHERE xyfir_id = ?',
      [JSON.stringify({ email }), row.xyfir_id]
    );
  }
  db.release();

})();