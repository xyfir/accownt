import { setPassword } from 'lib/account/set-password';
import storage from 'node-persist';

test('setPassword()', async () => {
  // Mock getting user from storage
  const mockGetItem = ((storage as any).getItem = jest.fn());
  const mockSetItem = ((storage as any).setItem = jest.fn());
  mockGetItem.mockResolvedValueOnce({
    email: 'test@example.com',
    password: 'abc'
  });
  mockGetItem.mockResolvedValueOnce({
    email: 'test@example.com',
    password: null
  });
  mockSetItem.mockResolvedValueOnce(undefined);

  // Remove password
  await setPassword(1234, null);
  expect(mockGetItem).toHaveBeenCalledTimes(1);
  expect(mockGetItem).toHaveBeenCalledWith('user-1234');
  expect(mockSetItem).toHaveBeenCalledTimes(1);
  expect(mockSetItem.mock.calls[0][0]).toBe('user-1234');
  expect(mockSetItem.mock.calls[0][1].email).toBe('test@example.com');
  expect(mockSetItem.mock.calls[0][1].password).toBeNull();

  // Add password
  await setPassword(1234, 'pass');
  expect(mockGetItem).toHaveBeenCalledTimes(2);
  expect(mockSetItem.mock.calls[1][1].password).toBeString();
});
