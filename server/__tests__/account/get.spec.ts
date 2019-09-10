import { getAccount } from 'lib/account/get';
import storage from 'node-persist';

test('getAccount()', async () => {
  // Mock getting user from storage
  (storage as any).init = jest.fn();
  const mockGetItem = ((storage as any).getItem = jest.fn());
  mockGetItem.mockResolvedValueOnce({
    email: 'test@example.com',
    password: 'a',
    totpSecret: 'b'
  });

  // Validate account
  const account = await getAccount(1234);
  expect(account.email).toBe('test@example.com');
  expect(account.hasPassword).toBeTrue();
  expect(account.hasTOTP).toBeTrue();

  // Validate mock calls
  expect(mockGetItem).toHaveBeenCalledTimes(1);
  expect(mockGetItem).toHaveBeenCalledWith('user-1234');
});
