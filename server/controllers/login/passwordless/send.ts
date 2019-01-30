import { NextFunction, Response, Request } from 'express';
import { sendPasswordlessLoginEmail } from 'lib/login/passwordless/send';

export function api_sendPasswordlessLoginEmail(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  sendPasswordlessLoginEmail(req.jwt && req.jwt.userId)
    .then(() => res.status(200).json({}))
    .catch(next);
}
