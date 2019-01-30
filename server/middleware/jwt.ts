const CONFIG = require('config');
const jwt = require('jsonwebtoken');

module.exports = async function(req, res, next) {
  try {
    if (!req.cookies.accowntJWT) throw 'No JWT provided';
    req.user = await new Promise((resolve, reject) =>
      jwt.verify(req.cookies.accowntJWT, CONFIG.JWT_KEY, (err, token) =>
        err ? reject(err) : resolve(token)
      )
    );
  } catch (err) {
    req.user = {};
  }
  next();
};
