const MySQL = require('lib/mysql');

/*
	GET /api/dashboard/developer/services/:id
	RETURN
		{
			id: number, name: string, description: string, info: json-string,
			owner: number, address: string, xyfir: boolean, keys: string[]
		}
*/
module.exports = async function(req, res) {
  const db = new MySQL();
  try {
    let rows = await db.query(
      'SELECT * FROM services WHERE owner = ? AND id = ?',
      [req.session.uid, req.params.id]
    );
    if (!rows.length) throw 'Could not find service';

    const response = rows[0];
    rows = await db.query(
      'SELECT service_key FROM service_keys WHERE service_id = ?',
      [req.params.id]
    );
    response.keys = rows.map(k => k.service_key);

    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err });
  }
  db.release();
};
