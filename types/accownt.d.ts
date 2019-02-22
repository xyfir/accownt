export namespace Accownt {
  export interface Account {
    hasPassword: boolean;
    hasTOTP: boolean;
    email: Accownt.User['email'];
  }

  export interface JWT {
    userId: User['id'];
    email: User['email'];
  }

  export interface User {
    /** Unix timestamp (in milliseconds!) of when they joined */
    id: number;
    email: string;
    /** Password hash or missing if the user does not use a password */
    password?: string;
    /** Have they verified their email? */
    verified: boolean;
    /** Number of failed login attempts within past 15 minutes */
    failedLogins: number;
    /** Unix timestamp of their last failed login attempt */
    lastFailedLogin: number;
    /** Secret used for generating their TOTP for Authy, etc */
    totpSecret?: string;
  }

  export namespace Env {
    export interface Common {
      /**
       * Is this a production environment?
       */
      PROD: boolean;
      /**
       * Your application's name as you want it displayed to users
       */
      NAME: string;
    }

    export interface Server extends Accownt.Env.Common {
      /**
       * Port the API will be hosted on
       */
      PORT: number;
      /**
       * Options for the user database (uses node-persist). All that's needed is `dir`
       * https://www.npmjs.com/package/node-persist#async-initoptions-callback
       */
      STORAGE: object;
      /**
       * This is the shared HS256 key which will be used by Accownt to sign JSON Web
       *  Tokens which your app will then verify using the same key
       */
      JWT_KEY: string;
      /**
       * Merged into nodemailer's `transporter.sendMail()`
       * https://nodemailer.com/usage/#sending-mail
       */
      SMTP_MAIL: object;
      /**
       * For Jest tests. Keep this as such so the TypeScript compiler is happy
       */
      TEST_STORAGE: object;
      /**
       * Your application's home page. Generally should not require authentication
       */
      APP_HOME_URL: string;
      /**
       * Used by `nodemailer.createTransport()`
       * https://nodemailer.com/smtp/
       */
      SMTP_TRANSPORT: object;
      /**
       * Where your users will be redirected after login. `{{JWT}}` will be replaced
       *  with the actual JWT.
       * @example "https://example.com/login?jwt={{JWT}}"
       */
      APP_LOGIN_URL: string;
      /**
       * Your reCAPTCHA key. Leave empty if you don't want reCAPTCHA verification
       */
      RECAPTCHA_KEY?: string;
      /**
       * How long until expiry of the main JWT that is saved to a cookie and passed
       *  to your application. Eg: `60 | "2 days" | "10h" | "7d"`. A numeric value is
       *  interpreted as a seconds count. If you use a string be sure you provide the
       *  time units (days, hours, etc).
       */
      JWT_EXPIRES_IN: string;
      /**
       * The name of the cookie which the JWT will be saved to.
       */
      JWT_COOKIE_NAME: string;
      /**
       * URL for Accownt's web client (where your users will access it)
       * @example "https://example.com/accownt"
       */
      ACCOWNT_WEB_URL: string;
      /**
       * URL for Accownt's API (accownt-server)
       * @example "https://example.com/api/accownt"
       */
      ACCOWNT_API_URL: string;
      /**
       * How long until expiry of a temporary JWT. Used in passwordless login and
       *  verification emails.
       * @example "1h"
       */
      TEMP_JWT_EXPIRES_IN: string;
    }

    export interface Web {}
  }
}
