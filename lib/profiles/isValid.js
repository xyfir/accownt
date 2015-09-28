module.exports = function(res, profile) {
	if (profile.name.length > 25 || profile.name.length == 0) {
		res.json({error: true, message: "Profile name must be 1-25 characters long."});
		return false;
	}
	else if (profile.fname.length > 50 || profile.lname.length > 50) {
		res.json({error: true, message: "First and last name fields limited to 50 characters."});
		return false;
	}
	else if (profile.address.length > 100) {
		res.json({error: true, message: "Street address 100 character limit exceeded."});
		return false;
	}
	else if (profile.zip.length > 10) {
		res.json({error: true, message: "Zip 10 character limit exceeded."});
		return false;
	}
	else if (profile.region.length > 25) {
		res.json({error: true, message: "State/Region/Province 25 character limit exceeded."});
		return false;
	}
	else if (profile.country.length != 0 && profile.country.length != 2) {
		res.json({error: true, message: "Country must be a two-letter ISO 3166-1 country code."});
		return false;
	}
	else if (profile.email.length > 0) {
		var regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
		if (!regex.test(profile.email)) {
			res.json({error: true, message: "Invalid email address provided."});
			return false;
		}
	}
	else if (profile.phone.length > 15) {
		res.json({error: true, message: "Phone number 15 character limit exceeded."});
		return false;
	}
	else if (profile.gender > 3) {
		res.json({error: true, message: "Invalid gender provided."});
		return false;
	}
	else if (profile.birthdate.length != 0) {
		var regex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
		if (!regex.test(profile.birthdate)) {
			res.json({error: true, message: "Invalid birthdate provided."});
			return false;
		}
	}
	/*else if (profile.picture.length > 0) {
		var picture = profile.picture.split('-');
		
		// Profile picture token == <user_id>-<random_string>
		if (picture[0] != profile.user_id || !picture[1].match(/^[a-z0-9]{10}$/)) {
			res.json({error: true, message: "An error occured attempting to process your profile picture."});
			return false;
		}
	}*/
	
	return true;
};