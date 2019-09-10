import { buildTemplate } from 'lib/email/build-template';
import { setPassword } from 'lib/account/set-password';
import { checkEmail } from 'lib/email/check';
import { cleanEmail } from 'lib/email/clean';
import { emailToId } from 'lib/email/to-id';
import { sendMail } from 'lib/email/send';
import * as storage from 'node-persist';
import { Accownt } from 'types/accownt';
import { signJWT } from 'lib/jwt';
import * as qs from 'qs';
import axios from 'axios';

const {
  EMAIL_VERIFICATION_HTML_TEMPLATE,
  EMAIL_VERIFICATION_TEXT_TEMPLATE,
  TEMP_JWT_EXPIRES_IN,
  ACCOWNT_API_URL,
  JWT_EXPIRES_IN,
  RECAPTCHA_KEY,
  STORAGE,
  NAME
} = process.enve;

export async function startRegistration(
  email: Accownt.User['email'],
  pass?: Accownt.User['password'],
  recaptcha?: string
): Promise<string> {
  // Check if recaptcha response is valid
  if (RECAPTCHA_KEY) {
    const captcha = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      qs.stringify({ secret: RECAPTCHA_KEY, response: recaptcha })
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
    lastFailedLogin: 0
  };
  await storage.init(STORAGE);
  await storage.setItem(`user-${user.id}`, user);
  await storage.setItem(`email-${email}`, user.id);

  // Set password if needed
  if (pass) await setPassword(user.id, pass);

  // Send verification email
  const token = await signJWT(user.id, email, TEMP_JWT_EXPIRES_IN);
  const link = `${ACCOWNT_API_URL}/register?jwt=${token}`;
  await sendMail({
    subject: `${NAME} Email Verification`,
    html: await buildTemplate({
      name: 'LINK',
      file: EMAIL_VERIFICATION_HTML_TEMPLATE,
      value: link,
      fallback: '<a href="%LINK%">Verify my email.</a>'
    }),
    text: await buildTemplate({
      name: 'LINK',
      file: EMAIL_VERIFICATION_TEXT_TEMPLATE,
      value: link,
      fallback: 'Verify your email: %LINK%"'
    }),
    to: email
  });

  return token;
}

export async function finishRegistration(jwt?: Accownt.JWT): Promise<string> {
  if (jwt === null) throw 'Invalid or expired token';

  // Verify JWT's userId matches the userId that the JWT's email points to
  // This way only the most recent email verification JWT is valid since it
  // will point to the newest user
  const userId = await emailToId(jwt.email);
  if (userId != jwt.userId)
    throw 'This token has been invalidated by a newer one';

  // Verify user's email
  await storage.init(STORAGE);
  const user: Accownt.User = await storage.getItem(`user-${jwt.userId}`);
  user.verified = true;
  await storage.setItem(`user-${jwt.userId}`, user);

  return await signJWT(jwt.userId, jwt.email, JWT_EXPIRES_IN);
}
