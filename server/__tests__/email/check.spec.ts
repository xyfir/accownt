import { checkEmail } from 'lib/email/check';
import * as storage from 'node-persist';

test('checkEmail() available: does not exist', async () => {
  // Mock getting user from storage
  (storage as any).init = jest.fn();
  const mockGetItem = ((storage as any).getItem = jest.fn());
  mockGetItem.mockResolvedValueOnce(undefined); // email -> userId

  // Validate user is not available
  const { available } = await checkEmail('test@example.com');
  expect(available).toBeTrue();

  // Validate mock calls
  expect(mockGetItem).toHaveBeenCalledTimes(1);
  expect(mockGetItem).toHaveBeenCalledWith('email-test@example.com');
});

test('checkEmail() available: exists but not verified', async () => {
  // Mock getting user from storage
  (storage as any).init = jest.fn();
  const mockGetItem = ((storage as any).getItem = jest.fn());
  mockGetItem.mockResolvedValueOnce(1234); // email -> userId
  mockGetItem.mockResolvedValueOnce(undefined); // userId -> user

  // Validate email is available
  const { available } = await checkEmail('test@example.com');
  expect(available).toBeTrue();

  // Validate mock calls
  expect(mockGetItem).toHaveBeenCalledTimes(2);
  expect(mockGetItem).toHaveBeenNthCalledWith(1, 'email-test@example.com');
  expect(mockGetItem).toHaveBeenNthCalledWith(2, 'user-1234');
});

test('checkEmail() not available', async () => {
  // Mock getting user from storage
  (storage as any).init = jest.fn();
  const mockGetItem = ((storage as any).getItem = jest.fn());
  mockGetItem.mockResolvedValueOnce(1234); // email -> userId
  mockGetItem.mockResolvedValueOnce({ verified: true }); // userId -> user

  // Validate email is not available
  const { available } = await checkEmail('test@example.com');
  expect(available).toBeFalse();

  // Validate mock calls
  expect(mockGetItem).toHaveBeenCalledTimes(2);
  expect(mockGetItem).toHaveBeenNthCalledWith(1, 'email-test@example.com');
  expect(mockGetItem).toHaveBeenNthCalledWith(2, 'user-1234');
});
