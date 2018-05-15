const validateToken = require('lib/tokens/validate');

/*
  GET api/recover/:uid/:auth
  DESCRIPTION
    If recovery link is valid, login user and set session.recovered = true
*/
module.exports = async function(req, res) {
  try {
    const isValid = await validateToken({
      user: req.params.uid,
      token: req.params.auth
    });

    if (!isValid) throw '';

    // When user logs in they can then change password without current
    (req.session.recovered = true), (req.session.uid = req.params.uid);

    res.redirect(
      req.session.redirect ? req.session.redirect : '/#/dashboard/user'
    );
    req.session.redirect = '';
  } catch (err) {
    res.redirect('/#/login');
  }
};
