var router = require('express').Router();
var home = require('../controllers/home');

router.get('/', home.view);

module.exports = router;