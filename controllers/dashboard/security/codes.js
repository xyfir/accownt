const config = require("../../../config");
const db = require("../../../lib/db");

/*
    PUT api/dashboard/security/codes
    REQUIRED
        type: number, count: number
    RETURN
        { error: bool, codes: string, message: string }
*/
module.exports = function(req, res) {
		
    // Check if user is removing all codes
    if (req.body.count == 0) {
        db(cn => {
            cn.query("UPDATE security SET codes = '' WHERE user_id = ?", [req.session.uid], (err, result) => {
                cn.release();
                res.json({error: false, codes: "", message: "Security codes removed from account."});
            });
        });
        return;
    }
    
    // Check provided data
    if (req.body.type > 3 || req.body.type == 0 || req.body.count > 20 || req.body.count < 5) {
        res.json({error: true, message: "Invalid data."});
        return;
    }
    
    // req.body.type: 1 = numbers, 2 = words, 3 = both
    let codes = [];
    let words = 0;
    let numbers = 0;
    
    // Calculate number of numbers to generate
    if (req.body.type == 1)
        numbers = req.body.count;
    else if (req.body.type == 3)
        numbers = Math.floor(Math.random() * req.body.count);
    
    // Calculate number of words to generate
    if (req.body.type == 2)
        words = req.body.count;
    else if (req.body.type == 3)
        words = req.body.count - numbers;
        
    // Add random numbers to list
    for (let i = 0; i < numbers; i++) {
        // 1000 - 9999
        codes.push(Math.floor(Math.random() * (10000 - 1000) + 1000));
    }
    
    const success = function() {
        // Shuffle array
        for (var i = codes.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = codes[i];//te
            codes[i] = codes[j];
            codes[j] = temp;
        }
        
        // Save list to database
        db(cn => {
            cn.query("UPDATE security SET codes = ? WHERE user_id = ?", [codes.toString(), req.session.uid], (err, result) => {
                cn.release();
                
                res.json({codes: codes.toString(), error: false, message: "Security codes successfully updated."});
            });
        });
    };
    
    if (req.body.type == 1)
        success();
    
    // Add random words to list
    require("request")(
        config.addresses.randword + config.keys.randword + "?count=" + words,
        (err, response, body) => {
            JSON.parse(body).words.forEach(word => {
                codes.push(word);
            });
            
            success();
        }
    );

}