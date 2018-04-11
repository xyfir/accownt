/**
 * @param {string} email
 * @return {string}
 */
const clean = email => /@gmail\.com$/.test(email)
  ? email.split('@')[0].replace(/\./g, '').replace(/\+.+$/, '') + '@gmail.com'
  : email;

/**
 * Strip Gmail emails down to their original format to prevent multiple
 *  accounts using same email.
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
module.exports = function(req, res, next) {

  if (req.query.email)
    req.query.email = clean(req.query.email);
  if (req.body.email)
    req.body.email = clean(req.body.email);

  next();

}