import { NextFunction, Response, Request } from 'express';
import { setPasswordless } from 'lib/account/set-passwordless';

export function api_setPasswordless(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  setPasswordless(req.jwt && req.jwt.userId, req.body.passwordless)
    .then(() => res.status(200).json({}))
    .catch(next);
}
