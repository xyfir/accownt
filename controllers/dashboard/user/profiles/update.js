const isProfileValid = require("lib/profiles/isValid");
const db = require("lib/db");

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
module.exports = function(req, res) {
		
    let profile = req.body;
    
    if (!isProfileValid(res, profile)) return;
    
    db(cn => {
        let sql = "UPDATE security SET "
            + "name = ?, fname = ?, lname = ?, address = ?, zip = ?, region = ?, "
            + "country = ?, email = ?, phone = ?, gender = ?, birthdate = ?, picture = ? "
            + "WHERE user_id = ? AND profile_id = ?";
        let values = [
            profile.name, profile.fname, profile.lname, profile.address, profile.zip,
            profile.region, profile.country, profile.email, profile.phone,
            profile.gender, profile.birthdate, profile.picture,
            req.session.uid, req.params.profile
        ];
        
        cn.query(sql, values, (err, result) => {
            cn.release();
            
            if (!err)
                res.json({error: false, message: "Profile successfully updated."});
            else
                res.json({error: true, message: "An unknown error occured."});
        });
    });

}