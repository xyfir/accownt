import { JWT_KEY } from 'constants/config';
import { Accownt } from 'types/accownt';
import * as jwt from 'jsonwebtoken';

export async function signJWT(
  userId: Accownt.User['id'],
  email: Accownt.User['email'],
  expiresIn: jwt.SignOptions['expiresIn']
): Promise<string> {
  return await new Promise((resolve, reject) =>
    jwt.sign({ userId, email }, JWT_KEY, { expiresIn }, (err, token) =>
      err ? reject(err) : resolve(token)
    )
  );
}
