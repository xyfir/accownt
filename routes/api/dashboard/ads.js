var router = require('express').Router();
var ads = require('../../../controllers/api/dashboard/ads');

router.get('/', ads.info);
router.put('/', ads.update);

module.exports = router;