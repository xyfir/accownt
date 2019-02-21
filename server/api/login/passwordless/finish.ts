import { NextFunction, Response, Request } from 'express';
import { finishPasswordlessLogin } from 'lib/login/passwordless/finish';

const { ACCOWNT_WEB_URL, JWT_COOKIE_NAME } = process.ENV;

export function api_finishPasswordlessLogin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  req.redirect = true;
  finishPasswordlessLogin(req.jwt)
    .then(token => {
      res.cookie(JWT_COOKIE_NAME, token);
      res.redirect(ACCOWNT_WEB_URL);
    })
    .catch(next);
}
