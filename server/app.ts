import 'app-module-path/register';
import { ACCOWNT_WEB_URL, WEB_DIRECTORY, PORT, PROD } from 'constants/config';
import { verifyRequestJWT } from 'lib/jwt/verify';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as Express from 'express';
import { Accownt } from 'types/accownt';
import { resolve } from 'path';
import { router } from 'api/router';

declare module 'express' {
  interface Request {
    redirect?: boolean;
    jwt?: Accownt.JWT;
  }
}

const app = Express();
if (!PROD) {
  // Needed to allow communication from webpack-dev-server host
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', ACCOWNT_WEB_URL);
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, DELETE'
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });
}
app.use('/static', Express.static(resolve(WEB_DIRECTORY, 'dist')));
app.use(bodyParser.urlencoded({ extended: true, limit: '2mb' }));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(verifyRequestJWT);
app.use('/api', router);
app.use(
  (
    err: string | Error,
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    let status: number;
    let error: string;
    // Error for user to see
    if (typeof err == 'string') {
      status = 400;
      error = err;
    }
    // Unexpected error
    else {
      console.error(err.stack);
      status = 500;
      error = 'Something went wrong...';
    }

    // Redirect and display error in app
    if (req.redirect)
      res.redirect(`${ACCOWNT_WEB_URL}?error=${encodeURIComponent(error)}`);
    // Return error to API client
    else res.status(status).json({ error });
  }
);
app.get('/*', (req, res) =>
  res.sendFile(resolve(WEB_DIRECTORY, 'dist', 'index.html'))
);
app.listen(PORT, () => console.log('Listening on', PORT));
