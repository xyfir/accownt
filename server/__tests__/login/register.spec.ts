import { finishRegistration, startRegistration } from 'lib/login/register';
import * as sendMail from 'lib/email/send';
import { verifyJWT } from 'lib/jwt';
import * as storage from 'node-persist';
import axios from 'axios';

test('startRegistration(), finishRegistration()', async () => {
  // Mock reCAPTCHA
  const mockPost = ((axios.post as any) = jest.fn());
  mockPost.mockResolvedValueOnce({ data: { success: true } });

  // Mock storage
  (storage as any).init = jest.fn();
  const mockGetItem = ((storage as any).getItem = jest.fn());
  const mockSetItem = ((storage as any).setItem = jest.fn());
  mockGetItem.mockResolvedValueOnce(undefined); // email -> userId
  mockSetItem.mockResolvedValue(undefined);

  // Mock sending mail
  const mockSendMail = ((sendMail as any).sendMail = jest.fn());
  mockSendMail.mockResolvedValue(undefined);

  // Start registration
  const tempToken = await startRegistration('test@example.com', null, '1234');
  const jwt = await verifyJWT(tempToken);
  expect(mockPost).toHaveBeenCalledTimes(1);
  expect(mockGetItem).toHaveBeenCalledTimes(1);
  expect(mockGetItem).toHaveBeenCalledWith('email-test@example.com');
  expect(mockSetItem).toHaveBeenCalledTimes(2);
  expect(mockSetItem.mock.calls[0][0]).toBe(`user-${jwt.userId}`);
  expect(mockSetItem.mock.calls[1][0]).toBe('email-test@example.com');
  expect(mockSendMail).toHaveBeenCalledTimes(1);

  // Mock storage
  mockGetItem.mockResolvedValueOnce(jwt.userId); // email -> userId
  mockGetItem.mockResolvedValueOnce({}); // userId -> user

  // Finish registration
  const fullToken = await finishRegistration(jwt);
  await expect(verifyJWT(fullToken)).not.toReject();
  expect(mockGetItem).toHaveBeenCalledTimes(3);
  expect(mockSetItem).toHaveBeenCalledTimes(3);
  expect(mockSetItem.mock.calls[2][1]).toMatchObject({ verified: true });
});
