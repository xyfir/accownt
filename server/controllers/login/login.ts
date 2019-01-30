import { NextFunction, Response, Request } from 'express';
import { ACCOWNT_WEB_URL } from 'constants/config';
import { login } from 'lib/login/login';

export function api_login(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  login(req.body.email, req.body.pass, req.body.otp)
    .then(token => {
      res.cookie('jwt', token);
      res.redirect(ACCOWNT_WEB_URL);
    })
    .catch(next);
}
