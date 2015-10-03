module.exports = function(uid, email) {
	require('../auth/generateToken')([uid], function(token) {
		require('./send')(
			email,
			'Xyfir Accounts - Account Recovery',
			'https://accounts.xyfir.com/recover/' + uid + '/' + token
		);
	});
};