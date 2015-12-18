var router = require('express').Router();
var login = require('../../controllers/api/login');

router.post('/', login.login);
router.post('/verify', login.verify);
router.get('/passwordless/:email', login.passwordless);

module.exports = router;