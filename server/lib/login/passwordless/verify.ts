import { JWT_KEY } from 'constants/config';
import { Accownt } from 'types/accownt';
import * as jwt from 'jsonwebtoken';

/**
 * Takes in a temporary passwordless login token and returns a longer lasting
 *  one for actual use.
 */
export async function verifyPasswordlessLogin(
  encoded: string
): Promise<string> {
  const decoded: Accownt.JWT = await new Promise((resolve, reject) =>
    jwt.verify(encoded, JWT_KEY, {}, (err, token) =>
      err ? reject(err) : resolve(token as Accownt.JWT)
    )
  );
  return await new Promise((resolve, reject) =>
    jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      JWT_KEY,
      { expiresIn: '30d' },
      (err, token) => (err ? reject(err) : resolve(token))
    )
  );
}
