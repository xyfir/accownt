import { NextFunction, Response, Request } from 'express';
import { deleteAccount } from 'lib/account/delete';

export function api_deleteAccount(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  deleteAccount(req.jwt && req.jwt.userId)
    .then(info => res.status(200).json(info))
    .catch(next);
}
