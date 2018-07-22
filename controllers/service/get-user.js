const validateToken = require('lib/tokens/validate');
const generateToken = require('lib/tokens/generate');
const MySQL = require('lib/mysql');

/*
  GET /api/service/:service/user
  REQUIRED
    key: string, xid: string, token: string
  RETURNS
    {
      message?: string,
      accessToken?: string?
      fname, country, ...
    }
  DESCRIPTION
    Called by service upon successful login OR with access token to start new session
    Token can be authorization (starts with 1) or access token (starts with 2)
    Generates and returns an access token if token starts with 1
*/
module.exports = async function(req, res) {
  const db = new MySQL();

  try {
    await db.getConnection();

    // Verify service exists and service key is valid
    let [row] = await db.query(
      `
        SELECT id FROM services WHERE id IN (
          SELECT service_id FROM service_keys
          WHERE service_id = ? AND service_key = ?
        )
      `,
      [req.params.service, req.query.key]
    );
    if (!row) throw 'Service id and key do not match';

    // Check if xid matches service
    [row] = await db.query(
      `
        SELECT user_id, info FROM linked_services
        WHERE service_id = ? AND xyfir_id = ?
      `,
      [req.params.service, req.query.xid]
    );
    if (!row) throw 'Xyfir id not linked to service';

    const uid = row.user_id;
    const token = req.query.token;

    // Check if authentication/access token is valid
    const isValid = await validateToken({
      user: uid,
      service: req.params.service,
      token
    });
    if (!isValid) throw 'Invalid token';

    // Grab info that user provided to service
    const data = JSON.parse(row.info);
    data.error = false;

    // Generate access token
    if (token[0] == '1') {
      data.accessToken = await generateToken({
        user: uid,
        service: req.params.service,
        type: 2
      });
    }

    db.release();
    res.status(200).json(data);
  } catch (err) {
    db.release();
    res.status(400).json({ message: err });
  }
};
