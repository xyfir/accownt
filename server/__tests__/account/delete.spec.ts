import { deleteAccount } from 'lib/account/delete';
import { verifyJWT } from 'lib/jwt';
import storage from 'node-persist';

test('deleteAccount()', async () => {
  // Mock storage
  (storage as any).init = jest.fn();
  const mockGetItem = ((storage as any).getItem = jest.fn());
  const mockRemoveItem = ((storage as any).removeItem = jest.fn());
  mockGetItem.mockResolvedValueOnce({ email: 'test@example.com' });

  // Delete account
  const { url } = await deleteAccount(1234);
  await verifyJWT(url.split('?jwt=')[1]);
  expect(mockGetItem).toHaveBeenCalledTimes(1);
  expect(mockGetItem).toHaveBeenCalledWith('user-1234');
  expect(mockRemoveItem).toHaveBeenCalledTimes(2);
  expect(mockRemoveItem).toHaveBeenNthCalledWith(1, 'email-test@example.com');
  expect(mockRemoveItem).toHaveBeenNthCalledWith(2, 'user-1234');
});
