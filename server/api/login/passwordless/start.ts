import { NextFunction, Response, Request } from 'express';
import { startPasswordlessLogin } from 'lib/login/passwordless/start';

export function api_startPasswordlessLogin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  startPasswordlessLogin(req.body.email)
    .then(() => res.status(200).json({}))
    .catch(next);
}
