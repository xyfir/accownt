var router = require('express').Router();
var services = require('../../../controllers/api/dashboard/services');

router.get('/', services.getAll);
router.route('/:service')
	.get(services.getSingle)
	.put(services.update)
	.del(services.remove);

module.exports = router;