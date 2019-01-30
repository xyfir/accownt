import * as storage from 'node-persist';
import { STORAGE } from 'constants/config';
import { Accownt } from 'types/accownt';
import { signJWT } from 'lib/jwt/sign';

export async function finishRegistration(jwt?: Accownt.JWT): Promise<string> {
  if (jwt === null) throw 'Invalid or expired token';

  // Verify user's email
  await storage.init(STORAGE);
  const user: Accownt.User = await storage.getItem(`user-${jwt.userId}`);
  user.verified = true;
  await storage.setItem(`user-${jwt.userId}`, user);

  return await signJWT(jwt.userId, jwt.email, '30d');
}
