const db = require('lib/db');

/*
	GET /api/dashboard/developer/services
	RETURN
		{services: [
			{ id: number, name: string }
		]}
*/
module.exports = function(req, res) {
  db(cn => {
    const sql = 'SELECT id, name FROM services WHERE owner = ?';
    cn.query(sql, [req.session.uid], (err, services) => {
      cn.release();

      res.status(200).json({ services });
    });
  });
};
