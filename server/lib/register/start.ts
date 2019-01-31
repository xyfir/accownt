import { setPassword } from 'lib/account/set-password';
import { checkEmail } from 'lib/register/check-email';
import { cleanEmail } from 'lib/email/clean';
import { sendMail } from 'lib/email/send';
import * as storage from 'node-persist';
import { Accownt } from 'types/accownt';
import { signJWT } from 'lib/jwt/sign';
import axios from 'axios';
import {
  ACCOWNT_API_URL,
  RECAPTCHA_KEY,
  STORAGE,
  NAME
} from 'constants/config';

export async function startRegistration(
  email: Accownt.User['email'],
  pass?: Accownt.User['password'],
  recaptcha?: string
): Promise<string> {
  // Check if recaptcha response is valid
  if (RECAPTCHA_KEY) {
    const captcha = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      { secret: RECAPTCHA_KEY, response: recaptcha }
    );
    if (!captcha.data.success) throw 'Invalid captcha';
  }

  email = cleanEmail(email);
  const { available } = await checkEmail(email);
  if (!available) throw 'Email is already taken';

  // Create user- and email- storage entries
  const user: Accownt.User = {
    id: Date.now(),
    email,
    password: null,
    verified: false,
    totpSecret: null,
    failedLogins: 0,
    passwordless: true,
    lastFailedLogin: 0
  };
  await storage.init(STORAGE);
  await storage.setItem(`user-${user.id}`, user);
  await storage.setItem(`email-${email}`, user.id);

  // Set password if needed
  if (pass) await setPassword(user.id, pass);

  // Send verification email
  const token = await signJWT(user.id, email, '1h');
  await sendMail({
    subject: `${NAME} Email Verification`,
    text: `${ACCOWNT_API_URL}/register?jwt=${token}`,
    to: email
  });

  return token;
}
