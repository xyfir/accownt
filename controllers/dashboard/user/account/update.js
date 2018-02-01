const bcrypt = require('bcrypt');
const MySQL = require('lib/mysql');

/*
  PUT api/dashboard/user/account
  REQUIRED
    currentPassword: string, newPassword: string
  RETURN
    { error: boolean, message: string }
*/
module.exports = async function(req, res) {

  const { currentPassword, newPassword } = req.body;
  const db = new MySQL;

  try {
    await db.getConnection();
    const [row] = await db.query(
      'SELECT password FROM users WHERE id = ?',
      [req.session.uid]
    );

    if (!row) throw 'Could not find user';

    // Check if current password matches
    const match = await bcrypt.compare(currentPassword, row.password);

    if (!match && !req.session.recovered)
      throw 'Incorrect password';

    const hash = await bcrypt.hash(newPassword, 10);

    // Update password
    const result = await db.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hash, req.session.uid]
    );
    db.release();

    if (!result.affectedRows) throw 'Could not update password';

    res.json({
      error: false, message: 'Password successfully updated'
    });

    req.session.recovered = false;
  }
  catch (err) {
    db.release();
    res.json({ error: true, message: err });
  }

}