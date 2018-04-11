const mysql = require('lib/mysql');

/**
 * Validates data supplied from a user to a service.
 * @async
 * @param {Express.Request}
 * @return {object}
 */
module.exports = async function(req) {

  let sql = '', vars = [], rows = [];
  const db = new mysql();

  try {
    await db.getConnection();

    // Grab requested info from service
    sql = `
      SELECT info FROM services WHERE id = ?
    `,
    vars = [
      req.params.service
    ],
    rows = await db.query(sql, vars);

    db.release();

    const required = JSON.parse(rows[0].info).required;

    // Loop through info's required values and make sure user provided values
    Object.keys(required).forEach(key => {
      if (!req.body[key] || req.body[key] == '0000-00-00')
        throw 'Required field(s) empty';
    });

    return {
      result: 'valid',
      info: {
        email: req.body.email, fname: req.body.fname, lname: req.body.lname,
        gender: req.body.gender, phone: req.body.phone, zip: req.body.zip,
        country: req.body.country, birthdate: req.body.birthdate,
        address: req.body.address, region: req.body.region
      }
    };
  }
  catch (err) {
    db.release();
    return { result: err };
  }

}