const validateProfile = require('lib/profiles/validate');
const mysql = require('lib/mysql');

/*
  PUT api/dashboard/user/profiles/:profile
  REQUIRED
    name: string, fname: stirng, lname: string, address: string,
    zip: string, region: string,  country: string,
    email: string, phone: string, gender: number,
    birthdate: string
  RETURN
    { error: bool, message: string }
*/
module.exports = async function(req, res) {
  
  const profile = req.body, db = new mysql();
  
  try {
    validateProfile(profile);

    const sql = `
      UPDATE profiles SET
        name = ?, fname = ?, lname = ?, address = ?, zip = ?, region = ?,
        country = ?, email = ?, phone = ?, gender = ?, birthdate = ?,
        picture = ?
      WHERE user_id = ? AND profile_id = ?
    `,
    vars = [
      profile.name, profile.fname, profile.lname, profile.address, profile.zip,
      profile.region, profile.country, profile.email, profile.phone,
      profile.gender, profile.birthdate, profile.picture,
      req.session.uid, req.params.profile
    ];

    await db.getConnection();
    const result = await db.query(sql, vars);

    if (!result.affectedRows) throw 'Could not update profile';
    
    db.release();
    res.json({ error: false, message: 'Profile successfully updated' });
  }
  catch (err) {
    db.release();
    res.json({ error: true, message: err });
  }

}