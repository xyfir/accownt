const config = require('config');
const mysql = require('mysql');

// Set global['__mysql'] equal to a client pool
if (global['__mysql'] === undefined) {
  global['__mysql'] = mysql.createPool(config.db);
}

/**
 * Wraps mysql package and uses promises in place of callbacks.
 */
class MySQL {
  /**
   * Retrieve a connection from the connection pool
   * @return {Promise} A promise that resolves when a connection is retrieved
   * and rejects with error message.
   */
  getConnection() {
    return new Promise((resolve, reject) => {
      // Cannot open another connection until previous is released
      if (this.cn) {
        resolve();
        return;
      }

      global['__mysql'].getConnection((err, cn) => {
        if (err) {
          reject('An unknown error occured');
        } else {
          this.cn = cn;
          resolve();
        }
      });
    });
  }

  /**
   * Sends query to database
   * @async
   * @param {string} [sql] - SQL query string
   * @param {any[]|object} [vars] - Variables to insert at '?' in sql
   * @return {object|object[]} A promise that resolves to the database's response
   * and rejects with error message.
   */
  query(sql = '', vars = []) {
    return new Promise((resolve, reject) =>
      this.cn.query(sql, vars, (err, res) => (err ? reject(err) : resolve(res)))
    );
  }

  /**
   * Releases instance connection back to pool if it exists
   */
  release() {
    this.cn && this.cn.release();
    this.cn = null;
  }
}

module.exports = MySQL;
