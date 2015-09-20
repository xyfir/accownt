var router = require('express').Router();
var login = require('../controllers/login');

router.get('/', login.login);
router.get('/:service', login.loginService);

module.exports = router;