import { JWT_EXPIRES_IN } from 'constants/config';
import { Accownt } from 'types/accownt';
import { signJWT } from 'lib/jwt/sign';

export async function finishPasswordlessLogin(
  jwt?: Accownt.JWT
): Promise<string> {
  if (jwt === null) throw 'Invalid or expired token';
  return await signJWT(jwt.userId, jwt.email, JWT_EXPIRES_IN);
}
