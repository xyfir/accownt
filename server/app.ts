import 'app-module-path/register';
import { PORT, WEB_DIRECTORY } from 'constants/config';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { verifyJWT } from 'lib/jwt/verify';
import * as Express from 'express';
import { Accownt } from 'types/accownt';
import { resolve } from 'path';
import { router } from 'api/routers';

declare module 'express' {
  interface Request {
    jwt?: Accownt.JWT;
  }
}

const app = Express();
app.use('/static', Express.static(resolve(WEB_DIRECTORY, 'dist')));
app.use(bodyParser.urlencoded({ extended: true, limit: '2mb' }));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(verifyJWT);
app.use('/api', router);
app.use(
  (
    err: string | Error,
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    if (typeof err == 'string') {
      res.status(400).json({ error: err });
    } else {
      console.error(err.stack);
      res.status(500).json({ error: 'Something went wrong...' });
    }
  }
);
app.get('/*', (req, res) =>
  res.sendFile(resolve(WEB_DIRECTORY, 'dist', 'index.html'))
);
app.listen(PORT, () => console.log('Listening on', PORT));
