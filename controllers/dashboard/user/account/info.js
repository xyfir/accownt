const mysql = require('lib/mysql');

/*
	GET api/dashboard/user/account
	RETURN
		{
			loggedIn: boolean,
			recovered?: boolean, affiliate?: boolean, google?: boolean,
      email?: string
		}
*/
module.exports = async function(req, res) {

  const db = new mysql;

  try {
    if (!req.session.uid) throw 'Not logged in';

    await db.getConnection();

    const sql = `
      SELECT email, affiliate, google FROM users WHERE id = ?
    `,
    vars = [
      req.session.uid
    ],
    rows = await db.query(sql, vars);

    if (!rows.length) throw 'Could not find user';

    rows[0].recovered = req.session.recovered, rows[0].loggedIn = true;
    res.json(rows[0]);
  }
  catch (err) {
    db.release();
    res.json({ loggedIn: false });
  }

}