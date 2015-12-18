var router = require('express').Router();
var service = require('../controllers/service');

// accounts.xyfir.com/service/dashboard
router.get('/dashboard/*', service.view);

module.exports = router;