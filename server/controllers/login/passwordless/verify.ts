import { NextFunction, Response, Request } from 'express';
import { verifyPasswordlessLogin } from 'lib/login/passwordless/verify';

export function api_verifyPasswordlessLogin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  verifyPasswordlessLogin(req.query.jwt)
    .then(() => res.status(200).json({}))
    .catch(next);
}
