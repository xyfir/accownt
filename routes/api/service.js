var router = require('express').Router();
var service = require('../../controllers/api/service');
var dashboard = require('../../controllers/api/service-dashboard');

// Used for managing/creating/viewing services from dashboard
router.route('/dashboard')
	.get(dashboard.getAll)
	.post(dashboard.create);
router.route('/dashboard/:id')
	.get(dashboard.getSingle)
	.put(dashboard.edit)
	.delete(dashboard.remove);

// Misc API routes
router.get('/:service', service.info);
router.get('/:service/:xid/:token', service.getUser);
router.post('/link/:service', service.linkService);
router.post('/session/:service', service.createSession);

module.exports = router;