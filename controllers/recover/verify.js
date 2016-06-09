const db = require("../../lib/db");

/*
    POST api/recover/verify
    REQUIRED
        email: string, uid: number
    RETURN
        {
            error: bool, message?: string, uid?: number,
            auth?: string, security?: { ** }
        }
*/
module.exports = function(req, res) {
    
    require("../../lib/security/validate")(req.body, function(response) {
        if (response.error) {
            res.json(response); // {error,message}
        }
        else {
            // Send account recovery email link
            require("../../lib/email/sendRecovery")(req.body.uid, req.body.email);
            
            res.json({
                error: false,
                message: "An account recovery link has been sent to your email."
            });
        }
    });
	
};