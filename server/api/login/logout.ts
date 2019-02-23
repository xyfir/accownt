import { Response, Request } from 'express';

const { APP_HOME_URL, JWT_COOKIE_NAME } = process.enve;

export function logout(req: Request, res: Response): void {
  res.clearCookie(JWT_COOKIE_NAME);
  res.redirect(APP_HOME_URL);
}
