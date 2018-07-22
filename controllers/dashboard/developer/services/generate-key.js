const randomstring = require('randomstring');
const MySQL = require('lib/mysql');

/*
	POST /api/dashboard/developer/services/:id/key
	RETURNED
		{ key?: string }
	DESCRIPTION
		Generate a new service key for service
*/
module.exports = async function(req, res) {
  const db = new MySQL();
  try {
    const rows = await db.query(
      'SELECT * FROM services WHERE id = ? AND owner = ?',
      [req.params.id, req.session.uid]
    );
    if (!rows.length) throw 'Bad id/key';

    const key = randomstring.generate(128);
    const result = await db.query(
      'INSERT INTO service_keys (service_id, service_key) VALUES (?, ?)',
      [req.params.id, key]
    );
    if (!result.affectedRows) throw 'Could not generate key';

    res.status(200).json({ key });
  } catch (err) {
    res.status(400).json({ message: err });
  }
  db.release();
};
