module.exports = function(email, link) {
	require('./send')(email, 'Xyfir Accounts - Passwordless Login', link);
};