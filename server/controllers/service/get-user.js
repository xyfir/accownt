const validateToken = require('lib/tokens/validate');
const generateToken = require('lib/tokens/generate');
const MySQL = require('lib/mysql');

/**
 * `GET /api/service/:service/user`
 *  Called by service upon successful login OR with access token to start new
 *  session. Token can be authorization (starts with `1`) or access token
 *  (starts with `2`). Generates and returns an access token if token starts
 *  with `1`.
 * @param {object} req
 * @param {object} req.query
 * @param {string} req.query.key
 * @param {string} req.query.xid
 * @param {string} req.query.token
 * @param {object} req.params
 * @param {number} req.params.service
 */
/**
 * @typedef {object} ResponseBody
 * @prop {string} [email]
 * @prop {string} [message]
 * @prop {string} [accessToken]
 */
module.exports = async function(req, res) {
  const db = new MySQL();
  try {
    const [row] = await db.query(
      `
        SELECT u.id, u.email
        FROM service_keys sk
        LEFT JOIN linked_services ls
          ON ls.xyfir_id = ? AND sk.service_id = ls.service_id
        LEFT JOIN users u
          ON u.id = ls.user_id
        WHERE sk.service_id = ? AND sk.service_key = ?
      `,
      [req.query.xid, req.params.service, req.query.key]
    );
    if (!row) throw 'Service id and key do not match';
    if (!row.id) throw 'Xyfir id not linked to service';

    const token = req.query.token;
    const user = +row.id;

    // Check if authentication/access token is valid
    const isValid = await validateToken({
      service: req.params.service,
      token,
      user
    });
    if (!isValid) throw 'Invalid token';

    const response = { email: row.email };

    // Generate access token
    if (token[0] == '1') {
      response.accessToken = await generateToken({
        service: req.params.service,
        type: 2,
        user
      });
    }

    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err });
  }
  db.release();
};
