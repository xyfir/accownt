const MySQL = require('lib/mysql');

/*
	DELETE /api/dashboard/developer/services/:id
	RETURN
		{ message: string }
*/
module.exports = async function(req, res) {
  const db = new MySQL();
  try {
    const result = await db.query(
      'DELETE FROM services WHERE owner = ? AND id = ?',
      [req.session.uid, req.params.id]
    );
    if (!result.affectedRows) throw 'Could not delete';

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err });
  }
  db.release();
};
