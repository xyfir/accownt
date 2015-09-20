var router = require('express').Router();
var register = require('../controllers/register');

router.get('/', register.createAccount);
router.get('/:serviceId', register.linkService);

module.exports = router;