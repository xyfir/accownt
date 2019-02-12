import { ACCOWNT_WEB_URL, JWT_COOKIE_NAME } from 'constants/config';
import { NextFunction, Response, Request } from 'express';
import { finishRegistration } from 'lib/register/finish';

export function api_finishRegistration(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  req.redirect = true;
  finishRegistration(req.jwt)
    .then(token => {
      res.cookie(JWT_COOKIE_NAME, token);
      res.redirect(ACCOWNT_WEB_URL);
    })
    .catch(next);
}
