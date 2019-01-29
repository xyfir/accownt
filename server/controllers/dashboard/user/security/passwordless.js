const MySQL = require('lib/mysql');

/*
  PUT /api/dashboard/user/security/passwordless
  REQUIRED
    passwordless: number
  RETURN
    { message: string }
*/
module.exports = async function(req, res) {
  const db = new MySQL();
  try {
    if (req.body.passwordless > 2) throw 'Invalid data';

    const result = await db.query(
      'UPDATE security SET passwordless = ? WHERE user_id = ?',
      [req.body.passwordless, req.session.uid]
    );
    if (!result.affectedRows) throw 'Could not update';

    res.status(200).json({
      message: 'Passwordless login option successfully updated'
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
  db.release();
};
