const router = require('express').Router();

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
router.get('/user/account', require('./user/account/info'));
router.put('/user/account', require('./user/account/update'));

/* Dashboard - User - Services */
router.get('/user/services', require('./user/services/get-all'));
router.get('/user/services/:service', require('./user/services/get-single'));
router.delete('/user/services/:service', require('./user/services/remove'));

/* Dashboard - User - Security */
router.get('/user/security', require('./user/security/info'));
router.put('/user/security/otp', require('./user/security/otp'));
router.put(
  '/user/security/passwordless',
  require('./user/security/passwordless')
);
router.get(
  '/user/security/recovery-code',
  require('./user/security/recovery-code/get')
);
router.put(
  '/user/security/recovery-code',
  require('./user/security/recovery-code/generate')
);

/* Dashboard - User - Tokens */
router.get('/user/tokens', require('./user/tokens/get'));
router.put('/user/tokens', require('./user/tokens/update'));
router.delete('/user/tokens', require('./user/tokens/delete'));

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
router.post(
  '/service/:service/verified',
  require('./service/create-verified-user')
);
router.get('/service/:service/user', require('./service/get-user'));

module.exports = router;
