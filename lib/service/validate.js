const validator = require("validator");

/*
	Validates data provided to create/edit service
	Returns an empty string for valid data
	Returns an error string when error
*/

module.exports = function(b) {
	if (!b.name || !b.name.match(/^[\w\d\s-]{3,25}$/))
		return "Invalid service name";
	if (!b.link || !validator.isURL(b.link))
		return "Invalid service link";
	if (!b.description || !b.description.match(/^[\w\d\s-,:\/.&?!@#$%*()]{3,150}$/))
		return "Invalid service description";

	var i = JSON.parse(b.info);
	
	// Validate all required/optional fields service wants from user
	for (var prop in i) {
		if (i.hasOwnProperty(prop)) {
			if ((i[prop].required || i[prop].optional) && !String(i[prop].value).match(/^[\w\d\s-\/]{3,25}$/))
				return "Invalid 'Used For' description for: " + prop;
			else if (i[prop].required && i[prop].optional)
				return "Requested user field '" + prop + "' cannot be both required and optional";
		}
	}
	
	return "";
};