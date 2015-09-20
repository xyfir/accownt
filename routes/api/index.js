var router = require('express').Router();

router.use('/sms', require('./sms'));
router.use('/register', require('./register'));

module.exports = router;