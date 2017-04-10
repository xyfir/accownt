const bcrypt = require('bcrypt');
const mysql = require('lib/mysql');

/*
  PUT api/dashboard/user/account
  REQUIRED
    currentPassword: string, newPassword: string
  RETURN
    { error: boolean, message: string }
*/
module.exports = async function(req, res) {

  const { currentPassword, newPassword } = req.body;
  const db = new mysql();

  try {
    await db.getConnection();

    const rows = await db.query(
      'SELECT password FROM users WHERE id = ?',
      [req.session.uid]
    );

    // Check if current password matches
    bcrypt.compare(currentPassword, rows[0].password, (err, match) => {
      if (match || req.session.recovered) {
        bcrypt.hash(newPassword, 10, (err, hash) => {
          // Update password
          db.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hash, req.session.uid]
          )
          .then(result => {
            db.release();
            res.json({
              error: false, message: 'Password successfully updated'
            });
          })
          .catch(err => {
            db.release();
            res.json({ error: true, message: 'An unknown error occurred' });
          });
        });
        
        req.session.recovered = false;
      }
      else {
        db.release();
        res.json({ error: true, message: 'Incorrect password' });
      }
    });
  }
  catch (err) {
    db.release();
    res.json({ error: true, message: 'An unknown error occurred' });
  }

}