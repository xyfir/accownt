import { NextFunction, Response, Request } from 'express';
import { JWT_KEY } from 'constants/config';
import * as jwt from 'jsonwebtoken';

export async function verifyJWT(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // JWT from URL via email
    if (req.query.jwt) {
      req.jwt = await new Promise((resolve, reject) =>
        jwt.verify(req.query.jwt, JWT_KEY, {}, (err, token) =>
          err ? reject(err) : resolve(token as Request['jwt'])
        )
      );
    }
    // JWT from cookie
    else if (req.cookies.jwt) {
      req.jwt = await new Promise((resolve, reject) =>
        jwt.verify(req.cookies.jwt, JWT_KEY, {}, (err, token) =>
          err ? reject(err) : resolve(token as Request['jwt'])
        )
      );
    }
    // Nothing to verify
    else {
      throw 'No JWT provided';
    }
  } catch (err) {
    req.jwt = null;
    if (req.cookies.jwt) res.clearCookie('jwt');
  }
  next();
}
