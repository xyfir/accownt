import { Response, Request } from 'express';
import { APP_HOME_URL } from 'constants/config';

export function logout(req: Request, res: Response): void {
  res.clearCookie('jwt');
  res.redirect(APP_HOME_URL);
}
