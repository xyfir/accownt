var router = require('express').Router();
var sms = require('../../controllers/api/sms');

router.get('/number/:phone', sms.sendByNumber);
router.get('/number/:phone/:code', sms.verifyCodeByNumber);
router.get('/user/:uid', sms.sendByUser);
router.get('/user/:uid/:code', sms.verifyCodeByUser);

module.exports = router;