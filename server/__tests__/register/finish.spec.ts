import { finishRegistration } from 'lib/register/finish';
import { startRegistration } from 'lib/register/start';
import { verifyJWT } from 'lib/jwt';
import axios from 'axios';

test('finishRegistration()', async () => {
  const mockPost = ((axios.post as any) = jest.fn());
  mockPost.mockResolvedValueOnce({ data: { success: true } });
  const tempToken1 = await startRegistration('test@example.com', 'test1234');

  mockPost.mockResolvedValueOnce({ data: { success: true } });
  const tempToken2 = await startRegistration('test@example.com', 'test1234');
  await expect(finishRegistration(await verifyJWT(tempToken1))).toReject();

  const fullToken = await finishRegistration(await verifyJWT(tempToken2));
  await expect(verifyJWT(fullToken)).not.toReject();
}, 10000);
