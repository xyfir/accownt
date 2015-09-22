var router = require('express').Router();

router.use('/sms', require('./sms'));
router.use('/login', require('./login'));
router.use('/register', require('./register'));

module.exports = router;