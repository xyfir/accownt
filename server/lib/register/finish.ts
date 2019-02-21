import { emailToId } from 'lib/email/to-id';
import * as storage from 'node-persist';
import { Accownt } from 'types/accownt';
import { signJWT } from 'lib/jwt/sign';

const { STORAGE, JWT_EXPIRES_IN } = process.ENV;

export async function finishRegistration(jwt?: Accownt.JWT): Promise<string> {
  if (jwt === null) throw 'Invalid or expired token';

  // Verify JWT's userId matches the userId that the JWT's email points to
  // This way only the most recent email verification JWT is valid since it
  // will point to the newest user
  const userId = await emailToId(jwt.email);
  if (userId != jwt.userId)
    throw 'This token has been invalidated by a newer one';

  // Verify user's email
  await storage.init(STORAGE);
  const user: Accownt.User = await storage.getItem(`user-${jwt.userId}`);
  user.verified = true;
  await storage.setItem(`user-${jwt.userId}`, user);

  return await signJWT(jwt.userId, jwt.email, JWT_EXPIRES_IN);
}
