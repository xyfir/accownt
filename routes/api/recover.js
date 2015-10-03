var router = require('express').Router();
var recover = require('../../controllers/api/recover');

router.post('/', recover.recover);
router.post('/verify', recover.verify);

module.exports = router;