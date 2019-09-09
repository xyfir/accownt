import { verifyJWT, signJWT } from 'lib/jwt';

test('signJWT(), verifyJWT()', async () => {
  const encoded = await signJWT(1234, 'test@example.com', '1m');
  const decoded = await verifyJWT(encoded);
  expect(decoded.userId).toBe(1234);
  expect(decoded.email).toBe('test@example.com');
});
