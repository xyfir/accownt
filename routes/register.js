var router = require('express').Router();
var register = require('../controllers/register');

router.get('/', register.createAccount);
router.get('/:service', register.linkService);

module.exports = router;