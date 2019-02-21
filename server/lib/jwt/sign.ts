import { Accownt } from 'types/accownt';
import * as jwt from 'jsonwebtoken';

const { JWT_KEY } = process.ENV;

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
