module.exports = {
	
	login: function(req, res) {
		if (req.session.uid)
			res.redirect('/dashboard');
		else
			res.render('login', {title: "Create Account - Xyfir Accounts"});
	},
	
	loginService: function(req, res) {
		if (req.session.uid) {
			// **
		}
		else {
			req.session.redirect = '/login/' + req.params.service;
			res.redirect('/login');
		}
	},
	
	// Verify uid + auth token and login user
	passwordless: function(req, res) {
		require('../lib/auth/validateToken')([req.params.uid], req.params.auth, function(isValid) {
			if (isValid) {
				require('../lib/login/doLogin')(req, req.params.uid);
				res.redirect(req.session.redirect ? req.session.redirect : '/dashboard');
			}
			else {
				res.redirect('/login');
			}
		});
	},
	
	logout: function(req, res) {
		res.session.uid = 0;
		res.redirect('/login');
	}
};