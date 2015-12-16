module.exports = {
	
	view: function(req, res) {
		res.status(200).render('index.jade', {title: "Xyfir Accounts"});
	}
	
};