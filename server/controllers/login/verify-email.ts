const validateToken = require('lib/tokens/validate');
const MySQL = require('lib/mysql');

/*
  GET /api/login/verify-email/:uid/:auth
  DESCRIPTION
    Verify a users email if :uid/:auth are valid
*/
module.exports = async function(req, res) {
  const db = new MySQL();

  try {
    const isValid = await validateToken({
      user: req.params.uid,
      token: req.params.auth
    });

    if (!isValid) throw 'Invalid token';

    req.session.uid = +req.params.uid;

    // Set verified
    await db.getConnection();
    const result = await db.query(
      'UPDATE users SET verified = ? WHERE id = ?',
      [1, req.params.uid]
    );

    if (!result.affectedRows) throw 'Could not verify email';

    // Delete unverified accounts with the same email
    const [{ email }] = await db.query('SELECT email FROM users WHERE id = ?', [
      req.params.uid
    ]);
    await db.query('DELETE FROM users WHERE email = ? AND verified = 0', [
      email
    ]);
    db.release();

    res.redirect(req.session.redirect ? req.session.redirect : '/user');
    req.session.redirect = '';
  } catch (err) {
    db.release();
    res.redirect('/login');
  }
};
