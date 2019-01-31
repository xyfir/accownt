import { finishPasswordlessLogin } from 'lib/login/passwordless/finish';
import { startPasswordlessLogin } from 'lib/login/passwordless/start';
import { finishRegistration } from 'lib/register/finish';
import { startRegistration } from 'lib/register/start';
import { setPassword } from 'lib/account/set-password';
import { checkEmail } from 'lib/register/check-email';
import { getAccount } from 'lib/account/get';
import { cleanEmail } from 'lib/email/clean';
import { emailToId } from 'lib/email/to-id';
import { verifyJWT } from 'lib/jwt/verify';
import * as storage from 'node-persist';
import { setTOTP } from 'lib/account/set-totp';
import { signJWT } from 'lib/jwt/sign';
import { TESTS } from 'constants/config';
import { login } from 'lib/login/login';
import { totp } from 'speakeasy';
import 'jest-extended';

beforeAll(async () => {
  try {
    const userId = await emailToId('test@example.com');
    await storage.init(TESTS.STORAGE);
    await storage.removeItem(`user-${userId}`);
    await storage.removeItem(`email-test@example.com`);
  } catch (err) {
    return;
  }
});

test('clean email', () => {
  expect(cleanEmail('e.m.a.il+test@gmail.com')).toBe('email@gmail.com');
  expect(cleanEmail('e.mail+t@example.com')).toBe('e.mail+t@example.com');
});

test('check email (available, does not exist)', async () => {
  const { available } = await checkEmail('test@example.com');
  expect(available).toBeTrue();
});

test('sign and verify jwt', async () => {
  const encoded = await signJWT(1234, 'test@example.com', '1m');
  const decoded = await verifyJWT(encoded);
  expect(decoded.userId).toBe(1234);
  expect(decoded.email).toBe('test@example.com');
});

test('start registration', async () => {
  const token = await startRegistration('test@example.com', 'test1234');
  await expect(verifyJWT(token)).not.toReject();
});

test('email to user id', async () => {
  const userId = await emailToId('test@example.com');
  expect(userId).toBeNumber();
  expect(userId.toString()).toMatch(/^\d{13}$/);
});

test('check email (available, exists but not verified)', async () => {
  const { available } = await checkEmail('test@example.com');
  expect(available).toBeTrue();
});

test('finish registration', async () => {
  const tempToken = await startRegistration('test@example.com', 'test1234');
  const fullToken = await finishRegistration(await verifyJWT(tempToken));
  await expect(verifyJWT(fullToken)).not.toReject();
});

test('check email (not available)', async () => {
  const { available } = await checkEmail('test@example.com');
  expect(available).toBeFalse();
});

test('login (no totp)', async () => {
  const token = await login('test@example.com', 'test1234');
  await expect(verifyJWT(token)).not.toReject();
});

test('get account', async () => {
  const userId = await emailToId('test@example.com');
  const account = await getAccount(userId);
  expect(account.email).toBe('test@example.com');
  expect(account.hasPassword).toBeTrue();
  expect(account.hasTOTP).toBeFalse();
});

test('set totp', async () => {
  const userId = await emailToId('test@example.com');
  let data = await setTOTP(userId, false);
  expect(data.secret).toBeUndefined();
  expect(data.url).toBeUndefined();

  data = await setTOTP(userId, true);
  expect(data.secret).toBeString();
  expect(data.secret).toHaveLength(128);
  expect(data.url).toBeString();

  const otp = totp({ secret: data.secret });
  expect(totp.verify({ secret: data.secret, token: otp })).toBeTrue();
});

test('login (with totp)', async () => {
  const userId = await emailToId('test@example.com');
  const data = await setTOTP(userId, true);
  const otp = totp({ secret: data.secret });

  const token = await login('test@example.com', 'test1234', otp);
  await expect(verifyJWT(token)).not.toReject();
});

test('passwordless login', async () => {
  const tempToken = await startPasswordlessLogin('test@example.com');
  await expect(verifyJWT(tempToken)).not.toReject();
  const fullToken = await finishPasswordlessLogin(await verifyJWT(tempToken));
  await expect(verifyJWT(fullToken)).not.toReject();
});

test('remove password', async () => {
  const userId = await emailToId('test@example.com');
  await expect(setPassword(userId, null)).not.toReject();
  const account = await getAccount(userId);
  expect(account.hasPassword).toBeFalse();
});
