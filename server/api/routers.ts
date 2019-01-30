import { Router } from 'express';
import * as c from 'api/controllers';

export const router = Router();

router.get('/account', c.api_getAccount);
router.put('/account/totp', c.api_setTOTP);
router.put('/account/password', c.api_setPassword);
router.put('/account/passwordless', c.api_setPasswordless);

router.get('/login/passwordless', c.api_finishPasswordlessLogin);
router.post('/login/passwordless', c.api_startPasswordlessLogin);

router.post('/login', c.api_login);
router.get('/login/logout', c.logout);

router.get('/register', c.api_finishRegistration);
router.post('/register', c.api_startRegistration);
router.post('/register/check-email', c.api_checkEmail);
