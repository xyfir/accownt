import * as storage from 'node-persist';
import { setTOTP } from 'lib/account/set-totp';
import { totp } from 'speakeasy';

test('setTOTP()', async () => {
  // Mock storage
  (storage as any).init = jest.fn();
  const mockGetItem = ((storage as any).getItem = jest.fn());
  const mockSetItem = ((storage as any).setItem = jest.fn());
  mockGetItem.mockResolvedValueOnce({
    email: 'test@example.com',
    totpSecret: 'abc'
  });
  mockGetItem.mockResolvedValueOnce({
    email: 'test@example.com',
    totpSecret: null
  });
  mockSetItem.mockResolvedValueOnce(undefined);

  // Disable TOTP
  let data = await setTOTP(1234, false);
  expect(data.secret).toBeUndefined();
  expect(data.url).toBeUndefined();

  // Validate mocks
  expect(mockGetItem).toHaveBeenCalledTimes(1);
  expect(mockGetItem).toHaveBeenCalledWith('user-1234');
  expect(mockSetItem).toHaveBeenCalledTimes(1);
  expect(mockSetItem.mock.calls[0][0]).toBe('user-1234');
  expect(mockSetItem.mock.calls[0][1].email).toBe('test@example.com');
  expect(mockSetItem.mock.calls[0][1].totpSecret).toBeNull();

  // Enable TOTP
  data = await setTOTP(1234, true);
  expect(data.secret).toBeString();
  expect(data.secret).toHaveLength(32);
  expect(data.url).toBeString();

  // Validate mocks
  expect(mockGetItem).toHaveBeenCalledTimes(2);
  expect(mockSetItem.mock.calls[1][1].totpSecret).toBeString();

  // Verify TOTP
  const otp = totp({ secret: data.secret });
  expect(totp.verify({ secret: data.secret, token: otp })).toBeTrue();
});
