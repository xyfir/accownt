var router = require('express').Router();

router.use('/ads', require('./ads'));
router.use('/account', require('./account'));
router.use('/profiles', require('./profiles'));
router.use('/security', require('./security'));
router.use('/services', require('./services'));

module.exports = router;