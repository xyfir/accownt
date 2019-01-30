import { NextFunction, Response, Request } from 'express';
import { setPassword } from 'lib/account/set-password';

export function api_setPassword(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  setPassword(req.jwt && req.jwt.userId, req.body.pass)
    .then(() => res.status(200).json({}))
    .catch(next);
}
