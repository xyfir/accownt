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
 * How long until expiry of the main JWT that is saved to a cookie and passed
 *  to your application. Eg: `60 | "2 days" | "10h" | "7d"`. A numeric value is
 *  interpreted as a seconds count. If you use a string be sure you provide the
 *  time units (days, hours, etc).
 */
export const JWT_EXPIRES_IN = '30d';
/**
 * The name of the cookie which the JWT will be saved to.
 */
export const JWT_COOKIE_NAME = 'jwt';
/**
 * URL for Accownt's web client (where your users will access it)
 */
export const ACCOWNT_WEB_URL = 'https://example.com/accownt';
/**
 * URL for Accownt's API (accownt-server)
 */
export const ACCOWNT_API_URL = 'https://example.com/api/accownt';
/**
 * How long until expiry of a temporary JWT. Used in passwordless login and
 *  verification emails.
 */
export const TEMP_JWT_EXPIRES_IN = '1h';
/**
 * Options for the user database (uses node-persist). All that's needed is `dir`
 * https://www.npmjs.com/package/node-persist#async-initoptions-callback
 */
export const STORAGE: InitOptions = {
  dir: '/path/to/accownt/user/db'
};
