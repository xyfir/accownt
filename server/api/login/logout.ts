import { APP_HOME_URL, JWT_COOKIE_NAME } from 'constants/config';
import { Response, Request } from 'express';

export function logout(req: Request, res: Response): void {
  res.clearCookie(JWT_COOKIE_NAME);
  res.redirect(APP_HOME_URL);
}
