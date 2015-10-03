var router = require('express').Router();

router.use('/sms', require('./sms'));
router.use('/login', require('./login'));
router.use('/recover', require('./recover'));
router.use('/register', require('./register'));
router.use('/dashboard', require('./dashboard/'));

module.exports = router;