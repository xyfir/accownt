/**
 * Get the data that a service requests from a profile linked to it.
 * @async
 * @param {object} db - A connected instance of lib/mysql.
 * @param {number} service - The service's id.
 * @param {object} data - Contains `profile`, `optional`, `required`.
 * @returns {object} The profile's data.
 */
module.exports = async function(db, service, data) {

  // Grab requested info from service
  let sql = `
    SELECT info FROM services WHERE id = ?
  `,
  vars = [
    service
  ],
  rows = await db.query(sql, vars);

  const requested = JSON.parse(rows[0].info);
  
  sql = `
    SELECT * FROM profiles WHERE profile_id = ?
  `,
  vars = [
    data.profile
  ],
  rows = await db.query(sql, vars);
  
  // Grab data from profile
  const provided = {};
  
  // Loop through requested.required and add data
  Object.keys(requested.required).forEach(key =>
    // Copy profile's data to provided's data
    // required.name: provided.name = profile.name
    provided[key] = rows[0][key]
  );
  
  // Loop through requested.optional if optional and add data
  if (data.optional) {
    Object.keys(requested.optional).forEach(key => 
      // Copy profile's data to provided's data
      provided[key] = rows[0][key]
    );
  }

  return provided;

}