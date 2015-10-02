var router = require('express').Router();
var login = require('../controllers/login');

router.get('/', login.login);
router.get('/logout', login.logout);
router.get('/:service', login.loginService);
router.get('/passwordless/:uid/:auth', login.passwordless);

module.exports = router;