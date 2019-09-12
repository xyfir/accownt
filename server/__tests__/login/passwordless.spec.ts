import * as sendMail from 'lib/email/send';
import { verifyJWT } from 'lib/jwt';
import storage from 'node-persist';
import {
  finishPasswordlessLogin,
  startPasswordlessLogin
} from 'lib/login/passwordless';

test('startPasswordlessLogin(), finishPasswordlessLogin()', async () => {
  // Mock storage
  const mockGetItem = ((storage as any).getItem = jest.fn());
  mockGetItem.mockResolvedValueOnce(1234); // email -> userId
  mockGetItem.mockResolvedValueOnce({
    id: 1234,
    email: 'test@example.com',
    verified: true
  }); // userId -> user

  // Mock sending mail
  const mockSendMail = ((sendMail as any).sendMail = jest.fn());
  mockSendMail.mockResolvedValue(undefined);

  // Start login
  const tempToken = await startPasswordlessLogin('test@example.com');
  expect(mockGetItem).toHaveBeenCalledTimes(2);
  expect(mockGetItem).toHaveBeenNthCalledWith(1, 'email-test@example.com');
  expect(mockGetItem).toHaveBeenNthCalledWith(2, 'user-1234');
  expect(mockSendMail).toHaveBeenCalledTimes(1);

  const fullToken = await finishPasswordlessLogin(await verifyJWT(tempToken));
  await expect(verifyJWT(fullToken)).not.toReject();
});
