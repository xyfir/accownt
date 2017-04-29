/**
 * Validates a profile's data. Throw an error if not valid.
 * @module lib/profiles/validate
 * @param {object} profile
 */
module.exports = function(profile) {

  if (profile.name.length > 25 || profile.name.length == 0)
    throw 'Profile name must be 1-25 characters long.';
  else if (profile.fname.length > 50 || profile.lname.length > 50)
    throw  'First and last name fields limited to 50 characters.';
  else if (profile.address.length > 100)
    throw 'Street address 100 character limit exceeded.';
  else if (profile.zip.length > 10)
    throw 'Zip 10 character limit exceeded.';
  else if (profile.region.length > 25)
    throw 'State/Region/Province 25 character limit exceeded.';
  else if (profile.country.length != 0 && profile.country.length != 2)
    throw 'Country must be a two-letter ISO 3166-1 country code.';
  else if (profile.email.length > 0 && !/.+@.+/.test(profile.email))
    throw 'Invalid email address provided.';
  else if (profile.phone.length > 15)
    throw 'Phone number 15 character limit exceeded.';
  else if (profile.gender > 3)
    throw 'Invalid gender provided.';

};