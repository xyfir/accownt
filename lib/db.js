const mysql = require('mysql');

// Set global["__mysql"] equal to a client pool
if (global['__mysql'] === undefined) {
  global['__mysql'] = mysql.createPool(require('../config').db);
}

module.exports = function(callback) {
  global['__mysql'].getConnection((err, cn) => {
    callback(cn);
  });
};
