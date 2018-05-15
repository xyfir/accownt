const rword = require('rword');
const mysql = require('lib/mysql');

const config = require('config');

/*
  PUT api/dashboard/user/security/codes
  REQUIRED
    type: number, count: number
  RETURN
    { error: bool, codes: string, message: string }
*/
module.exports = async function(req, res) {
  const db = new mysql();

  try {
    await db.getConnection();

    let sql = '',
      vars = [];

    // Check if user is removing all codes
    if (req.body.count == 0) {
      (sql = `
        UPDATE security SET codes = '' WHERE user_id = ?
      `),
        (vars = [req.session.uid]);

      await db.query(sql, vars);
      db.release();

      res.json({
        error: false,
        codes: '',
        message: 'Security codes removed from account'
      });
      return;
    }

    // Check provided data
    if (
      req.body.type > 3 ||
      req.body.type == 0 ||
      req.body.count > 20 ||
      req.body.count < 5
    )
      throw 'Invalid data';

    // req.body.type: 1 = numbers, 2 = words, 3 = both
    let codes = [],
      words = 0,
      numbers = 0;

    // Calculate number of numbers to generate
    if (req.body.type == 1) numbers = req.body.count;
    else if (req.body.type == 3)
      numbers = Math.floor(Math.random() * req.body.count);

    // Calculate number of words to generate
    if (req.body.type == 2) words = +req.body.count;
    else if (req.body.type == 3) words = +req.body.count - numbers;

    // Add random numbers to list
    for (let i = 0; i < numbers; i++) {
      // 1000 - 9999
      codes.push(Math.floor(Math.random() * (10000 - 1000) + 1000));
    }

    // Generate words
    if (words > 0) {
      codes = codes.concat(rword.generate(words));
    }

    // Shuffle array
    for (let i = codes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = codes[i];

      codes[i] = codes[j];
      codes[j] = temp;
    }

    (sql = `
      UPDATE security SET codes = ? WHERE user_id = ?
    `),
      (vars = [codes.join(','), req.session.uid]);

    await db.query(sql, vars);
    db.release();

    res.json({
      codes: codes.join(','),
      error: false,
      message: 'Security codes successfully updated'
    });
  } catch (err) {
    db.release();
    res.json({ error: true, message: err });
  }
};
