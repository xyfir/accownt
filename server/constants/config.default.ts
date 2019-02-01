import { InitOptions } from 'node-persist';

export const SMTP = {
  /**
   * Used by `nodemailer.createTransport()`
   * https://nodemailer.com/smtp/
   */
  TRANSPORT: {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'abc@ethereal.email',
      pass: 'pass'
    }
  },
  /**
   * Merged into nodemailer's `transporter.sendMail()`
   * https://nodemailer.com/usage/#sending-mail
   */
  MAIL: {
    from: 'accownts@example.com'
  }
};
/**
 * Port the API will be hosted on
 */
export const PORT = 12345;
/**
 * Is this a production environment?
 */
export const PROD = false;
/**
 * Your application's name as you want it displayed to users
 */
export const NAME = 'App';
/**
 * For Jest tests. Keep this as such so the TypeScript compiler is happy
 */
export const TESTS = {
  STORAGE: {
    dir: ''
  }
};
/**
 * This is the shared HS256 key which will be used by Accownt to sign JSON Web
 *  Tokens which your app will then verify using the same key
 */
export const JWT_KEY = 'some_secret_key1234';
/**
 * Your application's home page. Generally should not require authentication
 */
export const APP_HOME_URL = 'https://example.com';
/**
 * Where your users will be redirected after login. `{{JWT}}` will be replaced
 *  with the actual JWT.
 */
export const APP_LOGIN_URL = 'https://example.com/login?jwt={{JWT}}';
/**
 * Your reCAPTCHA key. Leave empty if you don't want reCAPTCHA verification
 */
export const RECAPTCHA_KEY = '';
/**
 * Absolute path to accownt-web
 */
export const WEB_DIRECTORY = '/path/to/accownt/web';
/**
 * URL for Accownt's web client (where your users will access it)
 */
export const ACCOWNT_WEB_URL = 'https://example.com/accownt';
/**
 * URL for Accownt's API (accownt-server)
 */
export const ACCOWNT_API_URL = 'https://example.com/api/accownt';
/**
 * Options for the user database (uses node-persist). All that's needed is `dir`
 * https://www.npmjs.com/package/node-persist#async-initoptions-callback
 */
export const STORAGE: InitOptions = {
  dir: '/path/to/accownt/user/db'
};
