var router = require('express').Router();
var register = require('../../controllers/api/register');

router.post('/', register.createAccount);
router.get('/email/:email', register.checkEmail);

module.exports = router;