import { NextFunction, Response, Request } from 'express';
import { checkEmail } from 'lib/register/check-email';

export function api_checkEmail(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  checkEmail(req.body.email)
    .then(info => res.status(200).json(info))
    .catch(next);
}
