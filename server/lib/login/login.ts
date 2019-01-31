import { cleanEmail } from 'lib/email/clean';
import { emailToId } from 'lib/email/to-id';
import * as storage from 'node-persist';
import { STORAGE } from 'constants/config';
import { Accownt } from 'types/accownt';
import { signJWT } from 'lib/jwt/sign';
import * as bcrypt from 'bcrypt';
import { totp } from 'speakeasy';

export async function login(
  email: Accownt.User['email'],
  pass: Accownt.User['password'],
  otp?: string
): Promise<string> {
  await storage.init(STORAGE);

  // Get user from email
  const userId = await emailToId(cleanEmail(email));
  const user: Accownt.User = await storage.getItem(`user-${userId}`);

  if (!user.password) throw 'You must request a passwordless login link';
  if (
    user.failedLogins >= 5 &&
    user.lastFailedLogin + 15 * 60 * 1000 > Date.now()
  )
    throw 'Too many failed logins; wait 15 minutes';

  // Check password
  const match = await bcrypt.compare(pass, user.password);
  if (!match) {
    user.failedLogins++;
    user.lastFailedLogin = Date.now();
    await storage.setItem(`user-${userId}`, user);
    throw `Email/password do not match (${user.failedLogins} failed logins)`;
  }

  // Check OTP
  if (user.totpSecret && !totp.verify({ secret: user.totpSecret, token: otp }))
    throw 'Invalid one-time password (2FA code)';

  return signJWT(userId, email, '30d');
}
