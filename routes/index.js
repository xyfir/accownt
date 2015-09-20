var express = require('express');

var routes = function() {
	var router = express.Router();
	
	router.route('/')
		.get(function(req, res) {
			var options = {
				page: {
					home: true
				},
				title: "Xyfir Accounts"
			};
			
			res.status(200).render('index.jade', options);
		});

	return router;
};

module.exports = routes;