const MySQL = require('lib/mysql');

/*
	DELETE /api/dashboard/developer/services/:id/key
  REQUIRED
    key: string
*/
module.exports = async function(req, res) {
  const db = new MySQL();
  try {
    const rows = await db.query(
      'SELECT * FROM services WHERE id = ? AND owner = ?',
      [req.params.id, req.session.uid]
    );
    if (!rows.length) throw 'Bad id/key';

    await db.query(
      'DELETE FROM service_keys WHERE service_id = ? AND service_key = ?',
      [req.params.id, req.body.key]
    );

    res.status(200).json({});
  } catch (err) {
    res.status(400).json({ message: err });
  }
  db.release();
};
