module.exports = {
	
	login: function(req, res) {
		if (req.session.uid)
			res.redirect('/dashboard');
		else
			res.render('login', {title: "Create Account - Xyfir Accounts"});
	},
	
	loginService: function(req, res) {
		if (req.session.uid) {
			res.render('loginService', {title: "One-Click Login - Xyfir Accounts"});
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
	
	verifyEmail: function(req, res) {
		require('../lib/auth/validateToken')([req.params.uid], req.params.auth, function(isValid) {
			if (isValid) {
				require('../lib/login/doLogin')(req, req.params.uid);
				
				// Set verified
				require('../lib/db')(function(connection) {
					connection.query('UPDATE users SET verified = ? WHERE id = ?', [1, req.params.uid], function(err, result) {
						connection.release();
						
						res.redirect(req.session.redirect ? req.session.redirect : '/dashboard');
					});
				});
			}
			else {
				res.redirect('/login');
			}
		});
	},
	
	logout: function(req, res) {
		req.session.uid = 0;
		res.redirect('/login');
	}
};