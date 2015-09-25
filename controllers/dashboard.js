module.exports = {
	
	dashboard: function(req, res) {
		if (!req.session.uid)
			res.redirect('/login');
		else
			res.render('dashboard', {title: "Dashboard - Xyfir Accounts"});
	}
	
};