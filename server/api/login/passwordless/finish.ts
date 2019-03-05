import { NextFunction, Response, Request } from 'express';
import { finishPasswordlessLogin } from 'lib/login/passwordless/finish';

const { ACCOWNT_WEB_URL, JWT_COOKIE_NAME } = process.enve;

export function api_finishPasswordlessLogin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  req.redirect = true;
  finishPasswordlessLogin(req.jwt)
    .then(token => {
      res.cookie(JWT_COOKIE_NAME, token, { maxAge: 31540000000 });
      res.redirect(ACCOWNT_WEB_URL);
    })
    .catch(next);
}
