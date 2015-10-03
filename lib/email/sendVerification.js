module.exports = function(uid, email) {
	require('../auth/generateToken')([uid], function(token) {
		require('./send')(
			email,
			'Xyfir Accounts - Email Verification',
			'https://accounts.xyfir.com/login/verify/' + uid + '/' + token
		);
	});
};