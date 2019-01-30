import { NextFunction, Response, Request } from 'express';
import { setTOTP } from 'lib/account/set-totp';

export function api_setTOTP(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  setTOTP(req.jwt && req.jwt.userId, req.body.enabled)
    .then(() => res.status(200).json({}))
    .catch(next);
}
