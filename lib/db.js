var pool = require('mysql').createPool(require('../config').db);

module.exports = function(callback) {
	pool.getConnection(function(err, connection) {
		callback(connection);
	});
};