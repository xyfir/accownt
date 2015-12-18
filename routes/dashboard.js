var router = require('express').Router();
var dashboard = require('../controllers/dashboard');

router.get('/*', dashboard.dashboard);

module.exports = router;