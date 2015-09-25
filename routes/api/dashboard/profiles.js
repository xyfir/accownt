var router = require('express').Router();
var profiles = require('../../../controllers/api/dashboard/profiles');

router.get('/', profiles.getAll);
router.route('/:profile')
	.get(profiles.getSingle)
	.put(profiles.update)
	.del(profiles.remove)
	.post(profiles.create);

module.exports = router;