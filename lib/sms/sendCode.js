var db = require('../db');

module.exports = function(uid, phone) {
	// Generate random code
	var code = 
		(Math.floor(Math.random() * (9999 - 1111 + 1) + 1111)).toString()
		+ ' ' +
		(Math.floor(Math.random() * (9999 - 1111 + 1) + 1111)).toString();
		
	
	// Save sms_code to security WHERE user_id AND phone
	db(function(connection) {
		connection.query('UPDATE security SET sms_code = ? WHERE user_id = ? AND phone = ?', [code, uid, phone], function(err, res) {
			connection.release();
			
			// Build SMS message
			var message = 'Xyfir Accounts - Security Code: ' + code;
			
			// Call ./send(phone, message)
			require('./send')(phone, message);
		});
	}); 
};