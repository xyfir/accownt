import { NextFunction, Response, Request } from 'express';
import { JWT_KEY } from 'constants/config';
import { Accownt } from 'types/accownt';
import * as jwt from 'jsonwebtoken';

export function verifyJWT(encoded: string): Promise<Accownt.JWT> {
  return new Promise((resolve, reject) =>
    jwt.verify(encoded, JWT_KEY, {}, (err, token) =>
      err ? reject(err) : resolve(token as Accownt.JWT)
    )
  );
}

export async function verifyRequestJWT(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // JWT from URL via email
    if (req.query.jwt) req.jwt = await verifyJWT(req.query.jwt);
    // JWT from cookie
    else if (req.cookies.jwt) req.jwt = await verifyJWT(req.cookies.jwt);
    // Nothing to verify
    else throw 'No JWT provided';
  } catch (err) {
    req.jwt = null;
    if (req.cookies.jwt) res.clearCookie('jwt');
  }
  next();
}
