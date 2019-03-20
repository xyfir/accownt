import { NextFunction, Response, Request } from 'express';
import { login } from 'lib/login/login';

const { JWT_COOKIE_NAME } = process.enve;

export function api_login(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  login(req.body.email, req.body.pass, req.body.otp)
    .then(token => {
      res.cookie(JWT_COOKIE_NAME, token, { maxAge: 31540000000 });
      res.status(200).json({ jwt: token });
    })
    .catch(next);
}
