module.exports = {
	
	createAccount: function(req, res) {
		if (req.session.uid)
			res.redirect('/dashboard');
		else
			res.render('register', {title: "Create Account - Xyfir Accounts"});
	},
	
	linkService: function(req, res) {
		if (req.session.uid) {
			res.render('linkService', {title: "Link Service - Xyfir Accounts"});
		}
		else {
			req.session.redirect = '/' + req.params.service;
			res.redirect('/login');
		}
	}
};