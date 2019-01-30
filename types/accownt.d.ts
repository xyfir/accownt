export namespace Accownt {
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
    /** If true, they _may_ have a password, but can also login without */
    passwordless: boolean;
    /** Secret used for generating their TOTP for Authy, etc */
    totpSecret?: string;
    /** A long string of text to recover their account with */
    recoveryToken?: string;
  }

  export interface JWT {
    userId: User["id"];
    email: User["email"];
  }
}
