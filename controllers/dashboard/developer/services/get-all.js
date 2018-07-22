const MySQL = require('lib/mysql');

/*
	GET /api/dashboard/developer/services
	RETURN
		{ services: [{ id: number, name: string }] }
*/
module.exports = async function(req, res) {
  const db = new MySQL();
  try {
    const services = await db.query(
      'SELECT id, name FROM services WHERE owner = ?',
      [req.session.uid]
    );
    res.status(200).json({ services });
  } catch (err) {
    res.status(400).json({ message: err });
  }
  db.release();
};
