var router = require('express').Router();
var service = require('../../controllers/api/service');

router.get('/:service/:xid/:token', service.getUser);
router.post('/link/:service', service.linkService);
router.post('/session/:service', service.createSession);

module.exports = router;