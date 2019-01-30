import { NextFunction, Response, Request } from 'express';
import { getAccount } from 'lib/account/get';

export function api_getAccount(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  getAccount(req.jwt && req.jwt.userId)
    .then(account => res.status(200).json(account))
    .catch(next);
}
