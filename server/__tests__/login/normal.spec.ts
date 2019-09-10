import { verifyJWT } from 'lib/jwt';
import * as storage from 'node-persist';
import { login } from 'lib/login/normal';
import { totp } from 'speakeasy';

test('login()', async () => {
  // Mock getting user from storage
  (storage as any).init = jest.fn();
  const mockGetItem = ((storage as any).getItem = jest.fn());
  mockGetItem.mockResolvedValueOnce(1234); // email -> userId
  mockGetItem.mockResolvedValueOnce({
    lastFailedLogin: 0,
    failedLogins: 5,
    totpSecret: 'C<N^}IWFAS9v}T?T8Wtvc(xTL0mPVogB',
    password: '$2a$10$I5KATOnD1ga1DuX1E9sLI.eAd7NKkiOt3ryRWCUcTQmC.0dl0yWLq'
  }); // userId -> user

  // Login
  const otp = totp({ secret: 'C<N^}IWFAS9v}T?T8Wtvc(xTL0mPVogB' });
  const token = await login('test@example.com', 'test1234', otp);

  // Validate
  await verifyJWT(token);
  expect(mockGetItem).toHaveBeenCalledTimes(2);
  expect(mockGetItem).toHaveBeenNthCalledWith(1, 'email-test@example.com');
  expect(mockGetItem).toHaveBeenNthCalledWith(2, 'user-1234');
});

test('login() fail', async () => {
  // Mock storage
  (storage as any).init = jest.fn();
  const mockGetItem = ((storage as any).getItem = jest.fn());
  const mockSetItem = ((storage as any).setItem = jest.fn());
  mockSetItem.mockResolvedValue(undefined);

  // No pass
  mockGetItem.mockResolvedValueOnce(1234);
  mockGetItem.mockResolvedValueOnce({ password: null });
  expect(login('test@example.com', '')).rejects.toMatch(/passwordless/);

  // Bad pass
  mockGetItem.mockResolvedValueOnce(1234);
  mockGetItem.mockResolvedValueOnce({ failedLogins: 0, password: 'bad' });
  await expect(login('test@example.com', 'bad')).rejects.toMatch(
    /1 failed logins/
  );
  expect(mockSetItem).toHaveBeenCalledTimes(1);
  expect(mockSetItem.mock.calls[0][1].lastFailedLogin).toBeNumber();

  // Bad TOTP
  mockGetItem.mockResolvedValueOnce(1234);
  mockGetItem.mockResolvedValueOnce({
    failedLogins: 0,
    totpSecret: 'C<N^}IWFAS9v}T?T8Wtvc(xTL0mPVogB',
    password: '$2a$10$I5KATOnD1ga1DuX1E9sLI.eAd7NKkiOt3ryRWCUcTQmC.0dl0yWLq'
  });
  await expect(login('test@example.com', 'test1234', '1234')).rejects.toMatch(
    /2FA/
  );

  // Limit hit
  mockGetItem.mockResolvedValueOnce(1234);
  mockGetItem.mockResolvedValueOnce({
    lastFailedLogin: Date.now(),
    failedLogins: 5,
    password: 'bad'
  });
  await expect(login('test@example.com', 'bad')).rejects.toMatch(/wait 15/);
});
