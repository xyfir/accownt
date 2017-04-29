const validateProfile = require('lib/profiles/validate');
const mysql = require('lib/mysql');

/*
  POST api/dashboard/user/profiles
  REQUIRED
    name: string, fname: stirng, lname: string, address: string, zip: string,
    region: string,  country: string, email: string, phone: string,
    gender: number, birthdate: string
  RETURN
    { error: bool, message: string }
*/
module.exports = async function(req, res) {
  
  const profile = req.body, db = new mysql();
  profile.user_id = req.session.uid;
  
  try {
    validateProfile(profile);

    await db.getConnection();

    const result = await db.query(
      'INSERT INTO profiles SET ?', profile
    );

    if (!result.insertId) throw 'Could not create profile';
    
    db.release();
    res.json({ error: false, message: 'Profile successfully created.' });
  }
  catch (err) {
    db.release();
    res.json({ error: true, message: err });
  }
  
}