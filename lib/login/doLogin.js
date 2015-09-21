module.exports = function(req, uid) {
	req.session.uid = uid;
};