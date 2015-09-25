var router = require('express').Router();
var security = require('../../../controllers/api/dashboard/security');

router.get('/', security.info);
router.put('/phone', security.phone);
router.put('/codes', security.codes);
router.put('/whitelist', security.whitelist);
router.put('/phone/verify', security.verifyPhone)
router.put('/passwordless', security.passwordless);

module.exports = router;