module.exports = {
	
	login: function(req, res) {
		if (req.session.uid)
			res.redirect('/dashboard');
		else
			res.render('login', {title: "Create Account - Xyfir Accounts"});
	},
	
	loginService: function(req, res) {

	}
};