import { NextFunction, Response, Request } from 'express';
import { Accownt } from 'types/accownt';
import * as jwt from 'jsonwebtoken';

const { JWT_KEY, JWT_COOKIE_NAME } = process.ENV;

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
    else if (req.cookies[JWT_COOKIE_NAME])
      req.jwt = await verifyJWT(req.cookies[JWT_COOKIE_NAME]);
    // Nothing to verify
    else throw 'No JWT provided';
  } catch (err) {
    req.jwt = null;
    if (req.cookies[JWT_COOKIE_NAME]) res.clearCookie(JWT_COOKIE_NAME);
  }
  next();
}
