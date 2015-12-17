module.exports = {
	
	view: function(req, res) {
		res.status(200).render('service.jade', {title: "Services - Xyfir Accounts"});
	}
	
};