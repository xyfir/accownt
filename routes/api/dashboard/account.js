var router = require('express').Router();
var account = require('../../../controllers/api/dashboard/account');

router.get('/', account.info);
router.put('/', account.update);

module.exports = router;