/*
  GET /api/login/logout
  DESCRIPTION
    Destroy user's session
*/
module.exports = function(req, res) {
  req.session.destroy(err => res.redirect(err ? '/dashboard' : '/login'));
};
