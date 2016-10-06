const db = require("lib/db");

module.exports = function(fn) {

    let sql = `
        DELETE FROM access_tokens WHERE NOW() > expires
    `;

    db(cn => cn.query(sql, (err, result) => {
        cn.release();
        fn(err);
    }));

}