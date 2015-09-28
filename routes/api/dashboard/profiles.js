var router = require('express').Router();
var profiles = require('../../../controllers/api/dashboard/profiles');

router.get('/', profiles.getAll);
router.route('/:profile')
	.get(profiles.getSingle)
	.put(profiles.update)
	.post(profiles.create)
	.delete(profiles.remove);
router.post('/:profile/picture', profiles.picture);

module.exports = router;