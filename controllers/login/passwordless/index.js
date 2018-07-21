const validateToken = require('lib/tokens/validate');

/*
  GET /api/login/passwordless/:uid/:auth
  DESCRIPTION
    Attempts to login user with :uid/:auth
*/
module.exports = async function(req, res) {
  try {
    const isValid = await validateToken({
      user: req.params.uid,
      token: req.params.auth
    });

    if (!isValid) throw '';

    req.session.uid = req.params.uid;

    res.redirect(
      req.session.redirect ? req.session.redirect : '/dashboard/user'
    );
    req.session.redirect = '';
  } catch (err) {
    res.redirect('/login');
  }
};
