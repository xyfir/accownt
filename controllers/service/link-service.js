const validateData = require('lib/services/validate-data');
const rstring = require('randomstring');
const mysql = require('lib/mysql');

/*
  POST api/service/:service/link
  RETURNED
    { error: bool, message: string }
  DESCRIPTION
    Link service to user's Xyfir Account
*/
module.exports = async function(req, res) {
  const db = new mysql();

  try {
    // Check if user provided required information
    let { result, info } = await validateData(req);

    if (result != 'valid') throw result;

    const insert = {
      service_id: req.params.service,
      xyfir_id: rstring.generate(64),
      info: JSON.stringify(info),
      user_id: req.session.uid
    };

    await db.getConnection();

    result = await db.query('INSERT INTO linked_services SET ?', insert);
    db.release();

    if (!result.affectedRows) throw 'An unknown error occured';

    res.status(200).json({ message: 'Service linked to account' });
  } catch (err) {
    db.release();
    res.status(400).json({ message: err });
  }
};
