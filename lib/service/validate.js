/**
 * Validates the data provided to created or edit a service. Throws an error 
 * when the data is invalid.
 * @param {Express.Request.body} s
 */
module.exports = function(s) {
  
  // Validate service info
  if (!s.name || !s.name.match(/^[\w\d\s-]{3,25}$/))
    throw 'Invalid name. Letters/numbers/spaces/3-25 characters allowed';
  else if (!s.urlMain || !s.urlMain.match(/^https:\/\//))
    throw 'Invalid website url. Must start with https://';
  else if (!s.urlLogin || !s.urlLogin.match(/^https:\/\//))
    throw 'Invalid login url. Must start with https://';
  else if (!s.description || !s.description.match(/^.{3,150}$/))
    throw 'Invalid description. 3-150 characters allowed.';

  const info = JSON.parse(s.info);

  Object.keys(info).forEach(key => {
    if (info[key].required == info[key].optional)
      throw `A field can only be required OR optional (${key})`;
    if (!/^[\w\d\s-\/]{1,75}$/.test(info[key].value))
      throw `Invalid 'Used For' description for '${key}'`;
  });
  
};