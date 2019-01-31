export namespace Accownt {
  export interface Account {
    hasPassword: boolean;
    loggedIn: boolean;
    hasTOTP: boolean;
    email: Accownt.User["email"];
  }

  export interface JWT {
    userId: User["id"];
    email: User["email"];
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
}
