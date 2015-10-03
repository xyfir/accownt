module.exports = {
	
	recover: function(req, res) {
		if (req.session.uid)
			res.redirect('/dashboard');
		else
			res.render('recover', {title: "Account Recovery - Xyfir Accounts"});
	},
	
	redirect: function(req, res) {
		require('../lib/auth/validateToken')([req.params.uid], req.params.auth, function(isValid) {
			if (isValid) {
				// Set account_recovery session variable to true
				// When user logs in they can then change password without current
				req.session.recovered = true;
				
				require('../lib/login/doLogin')(req, req.params.uid);
				res.redirect(req.session.redirect ? req.session.redirect : '/dashboard');
			}
			else {
				res.redirect('/login');
			}
		});
	}
	
};