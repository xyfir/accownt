const mysql = require('lib/mysql');

/**
 * Validates data supplied from a user to a service.
 * @async
 * @module lib/services/validate-data
 * @param {Express.Request}
 * @returns {object}
 */
module.exports = async function(req) {

  let sql = '', vars = [], rows = [];
  const db = new mysql();

  try {
    await db.getConnection();

    // User wants to load data from a profile
    if (req.body.profile) {
      if (req.body.required == 'false')
        throw 'You must allow access to required info';

      // Check if profile has data that service requires
      sql = `
        SELECT * FROM profiles WHERE user_id = ? AND profile_id = ?
      `,
      vars = [
        req.session.uid, req.body.profile
      ],
      rows = await db.query(sql, vars);
      
      if (!rows.length) throw 'Could not load profile';
      
      const profile = rows[0];
      
      // Grab data from service
      sql = `
        SELECT info FROM services WHERE id = ?
      `,
      vars = [
        req.params.service
      ],
      rows = await db.query(sql, vars);

      db.release();

      if (!rows.length) throw 'Could not load service info';
      
      const required = JSON.parse(rows[0].info).required;
      
      // Loop through auth.required and ensure profile has needed values
      Object.keys(required).forEach(key => {
        if (!profile[key] || profile[key] == '0000-00-00')
          throw 'Profile does contain values for required fields';
      });

      return {
        result: 'valid', info: {
          profile: req.body.profile,
          optional: req.body.optional
        }
      };
    }
    // User wants to set custom data
    else {
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
        result: 'valid', info: {
          email: req.body.email, fname: req.body.fname, lname: req.body.lname,
          gender: req.body.gender, phone: req.body.phone, zip: req.body.zip,
          country: req.body.country, birthdate: req.body.birthdate,
          address: req.body.address, region: req.body.region
        }
      };
    }
  }
  catch (err) {
    db.release();
    return { result: err };
  }

}