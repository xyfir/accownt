import { emailToId } from 'lib/email/to-id';
import storage from 'node-persist';

test('emailToId()', async () => {
  // Mock getting user from storage
  const mockGetItem = ((storage as any).getItem = jest.fn());
  mockGetItem.mockResolvedValueOnce(1234); // email -> userId

  // Validate user id
  const userId = await emailToId('test@example.com');
  expect(userId).toBe(1234);

  // Validate mock calls
  expect(mockGetItem).toHaveBeenCalledTimes(1);
  expect(mockGetItem).toHaveBeenCalledWith('email-test@example.com');
});
