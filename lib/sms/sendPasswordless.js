module.exports = function(phone, link) {
	require('./send')(phone, 'Xyfir Accounts - Passwordless Login: ' + link);
};