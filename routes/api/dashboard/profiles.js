var router = require('express').Router();
var profiles = require('../../../controllers/api/dashboard/profiles');

router.route('/')
	.get(profiles.getAll)
	.post(profiles.create);
router.route('/:profile')
	.get(profiles.getSingle)
	.put(profiles.update)
	.delete(profiles.remove);
router.post('/:profile/picture', profiles.picture);

module.exports = router;