var router = require('express').Router();
var recover = require('../controllers/recover');

router.get('/', recover.recover);
router.get('/:uid/:auth', recover.redirect);

module.exports = router;