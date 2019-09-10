import { startRegistration } from 'lib/register/start';
import { verifyJWT } from 'lib/jwt';
import axios from 'axios';

test('startRegistration()', async () => {
  const mockPost = ((axios.post as any) = jest.fn());
  mockPost.mockResolvedValueOnce({ data: { success: true } });
  const token = await startRegistration('test@example.com', 'test1234');
  await expect(verifyJWT(token)).not.toReject();
});
