var router = require('express').Router();
var account = require('../../controllers/api/dashboard/acccount');

router.get('/', account.info);
router.put('/', account.update);

module.exports = router;