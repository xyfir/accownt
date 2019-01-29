const createAccount = require('lib/users/create');
const rstring = require('randomstring');
const bcrypt = require('bcrypt');
const MySQL = require('lib/mysql');

/*
  POST /api/service/:service/verified
  REQUIRED
    email: string, key: string
  OPTIONAL
    password: string
  RETURN
    { message?: string, xyfir_id?: string }
*/
module.exports = async function(req, res) {
  const db = new MySQL();

  try {
    const { email, key, password } = req.body;
    if (!email || !key) throw 'Required field(s) empty';

    // Validate service key and id
    await db.getConnection();
    const [service] = await db.query(
      `
        SELECT id, owner FROM services WHERE id IN (
          SELECT service_id FROM service_keys
          WHERE service_id = ? AND service_key = ?
        )
      `,
      [req.params.service, req.body.key]
    );
    if (!service || service.owner != 1) throw 'Invalid service id/key';

    // Check if the user's email is available
    const [user] = await db.query(
      'SELECT id FROM users WHERE email = ? AND verified = ?',
      [email, 1]
    );
    if (user) throw 'Email is already linked to an account';

    // Create user's account
    const uid = await createAccount(db, {
      email,
      verified: true,
      password: password ? await bcrypt.hash(password, 10) : ''
    });

    // Link service to user
    const xyfir_id = rstring.generate(64);
    await db.query('INSERT INTO linked_services SET ?', {
      service_id: req.params.service,
      xyfir_id,
      user_id: uid
    });
    db.release();

    res.status(200).json({ xyfir_id });
  } catch (err) {
    db.release();
    res.status(400).json({ message: err });
  }
};
