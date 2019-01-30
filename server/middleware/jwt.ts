import { NextFunction, Response, Request } from 'express';
import { JWT_KEY } from 'constants/config';
import * as jwt from 'jsonwebtoken';

export async function jwtMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.cookies.accowntJWT) throw 'No JWT provided';
    req.jwt = await new Promise((resolve, reject) =>
      jwt.verify(req.cookies.accowntJWT, JWT_KEY, {}, (err, token) =>
        err ? reject(err) : resolve(token as Request['jwt'])
      )
    );
  } catch (err) {
    req.jwt = null;
  }
  next();
}
