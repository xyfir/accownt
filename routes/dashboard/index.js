var router = require('express').Router();

router.use('/', require('../../controllers/dashboard/'));
router.use('/profiles', require('./profiles'));
router.use('/security', require('./security'));

module.exports = router;