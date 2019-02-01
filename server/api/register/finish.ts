import { NextFunction, Response, Request } from 'express';
import { finishRegistration } from 'lib/register/finish';
import { ACCOWNT_WEB_URL } from 'constants/config';

export function api_finishRegistration(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  req.redirect = true;
  finishRegistration(req.jwt)
    .then(token => {
      res.cookie('jwt', token);
      res.redirect(ACCOWNT_WEB_URL);
    })
    .catch(next);
}
