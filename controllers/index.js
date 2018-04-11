const router = require('express').Router();

/* Affiliate */
router.post('/affiliate/signup', require('./affiliate/signup'));
router.post('/affiliate/purchase', require('./affiliate/purchase'));
router.get('/affiliate/promotions', require('./affiliate/get-promotions'));

/* Dashboard - Affiliate */
router.get(
  '/dashboard/affiliate',
  require('./dashboard/affiliate/get-campaigns')
);
router.post(
  '/dashboard/affiliate',
  require('./dashboard/affiliate/create-campaign')
);
router.delete(
  '/dashboard/affiliate/:code',
  require('./dashboard/affiliate/delete-campaign')
);

/* Dashboard - Developer - Services */
router.get(
  '/dashboard/developer/services',
  require('./dashboard/developer/services/get-all')
);
router.post(
  '/dashboard/developer/services',
  require('./dashboard/developer/services/create')
);
router.put(
  '/dashboard/developer/services/:id',
  require('./dashboard/developer/services/edit')
);
router.delete(
  '/dashboard/developer/services/:id',
  require('./dashboard/developer/services/remove')
);
router.get(
  '/dashboard/developer/services/:id',
  require('./dashboard/developer/services/get-single')
);
router.post(
  '/dashboard/developer/services/:id/key',
  require('./dashboard/developer/services/generate-key')
);
router.delete(
  '/dashboard/developer/services/:id/key',
  require('./dashboard/developer/services/delete-key')
);

/* Dashboard - User - Account */
router.get(
  '/dashboard/user/account',
  require('./dashboard/user/account/info')
);
router.put(
  '/dashboard/user/account',
  require('./dashboard/user/account/update')
);

/* Dashboard - User - Services */
router.get(
  '/dashboard/user/services',
  require('./dashboard/user/services/get-all')
);
router.get(
  '/dashboard/user/services/:service',
  require('./dashboard/user/services/get-single')
);
router.put(
  '/dashboard/user/services/:service',
  require('./dashboard/user/services/update')
);
router.delete(
  '/dashboard/user/services/:service',
  require('./dashboard/user/services/remove')
);

/* Dashboard - User - Security */
router.get(
  '/dashboard/user/security',
  require('./dashboard/user/security/info')
);
router.put(
  '/dashboard/user/security/otp',
  require('./dashboard/user/security/otp')
);
router.put(
  '/dashboard/user/security/codes',
  require('./dashboard/user/security/codes')
);
router.put(
  '/dashboard/user/security/passwordless',
  require('./dashboard/user/security/passwordless')
);
router.get(
  '/dashboard/user/security/recovery-code',
  require('./dashboard/user/security/recovery-code/get')
);
router.put(
  '/dashboard/user/security/recovery-code',
  require('./dashboard/user/security/recovery-code/generate')
);

/* Dashboard - User - Tokens */
router.get(
  '/dashboard/user/tokens', require('./dashboard/user/tokens/get')
);
router.put(
  '/dashboard/user/tokens', require('./dashboard/user/tokens/update')
);
router.delete(
  '/dashboard/user/tokens', require('./dashboard/user/tokens/delete')
);

/* Login */
router.post('/login', require('./login/step-1'));
router.get('/login/logout', require('./login/logout'));
router.post('/login/verify', require('./login/step-2'));

/* Login - Misc */
router.get('/login/verify-email/:uid/:auth', require('./login/verify-email'));
router.get('/login/passwordless/:uid/:auth', require('./login/passwordless/'));
router.get('/login/passwordless', require('./login/passwordless/send'));
router.post('/login/auth-id', require('./login/auth-id'));

/* Recover */
router.post('/recover', require('./recover/step-1'));
router.post('/recover/verify', require('./recover/step-2'));
router.get('/recover/:uid/:auth', require('./recover/'));

/* Register */
router.post('/register', require('./register/create-account'));
router.get('/register/email', require('./register/check-email'));

/* Service */
router.get('/service/:service', require('./service/info'));
router.post('/service/:service/link', require('./service/link-service'));
router.post('/service/:service/session', require('./service/create-session'));
router.get('/service/:service/user', require('./service/get-user'));

/* Service - DEPRECATED */
router.get('/service/:service/:key/:xid/:token', require('./service/get-user'));

module.exports = router;