const verify = require("../../../lib/sms/verifyCode");
const db = require("../../../lib/db");

/*
    PUT api/dashboard/security/phone/verify
    REQUIRED
        code: number
    RETURN
        { error: bool, message: string }
*/
module.exports = function(req, res) {
		
    verify(req.session.uid, req.body.code, isValid => {
        if (isValid)
            res.json({error: false, message: "Successfully updated phone number."});
        else
            res.json({error: true, message: "Invalid security code."});
    });

}