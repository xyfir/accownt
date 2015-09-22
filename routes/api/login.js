var router = require('express').Router();
var login = require('../../controllers/api/login');

router.post('/', login.login);
router.post('/verify', login.verify);
router.post('/:service', login.loginService);

module.exports = router;