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
};
