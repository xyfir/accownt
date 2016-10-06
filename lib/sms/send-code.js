const send = require("lib/sms/send");
const rand = require("lib/rand");
const db = require("lib/db");

module.exports = function(uid, phone) {
	// Generate random code
	const code = rand(100000, 999999);

	let sql = `
		UPDATE security SET sms_code = ? WHERE user_id = ? AND phone = ?
	`;
	
	// Save sms_code to security WHERE user_id AND phone
	db(cn => cn.query(sql, [code, uid, phone], (err, res) => {
		cn.release();
		
		send(phone, code + " - Xyfir Accounts security code");
	}));
};