import { buildTemplate } from 'lib/email/build-template';
import { emailToId } from 'lib/email/to-id';
import { sendMail } from 'lib/email/send';
import * as storage from 'node-persist';
import { Accownt } from 'types/accownt';
import { signJWT } from 'lib/jwt/sign';

const {
  PASSWORDLESS_LOGIN_HTML_TEMPLATE,
  PASSWORDLESS_LOGIN_TEXT_TEMPLATE,
  TEMP_JWT_EXPIRES_IN,
  ACCOWNT_API_URL,
  STORAGE,
  NAME
} = process.enve;

export async function startPasswordlessLogin(
  email: Accownt.User['email']
): Promise<string> {
  const userId = await emailToId(email);
  await storage.init(STORAGE);
  const user: Accownt.User = await storage.getItem(`user-${userId}`);

  const token = await signJWT(user.id, user.email, TEMP_JWT_EXPIRES_IN);
  const link = `${ACCOWNT_API_URL}/login/passwordless?jwt=${token}`;
  await sendMail({
    subject: `${NAME} Passwordless Login`,
    html: await buildTemplate({
      name: 'LINK',
      file: PASSWORDLESS_LOGIN_HTML_TEMPLATE,
      value: link,
      fallback: '<a href="%LINK%">Login.</a>'
    }),
    text: await buildTemplate({
      name: 'LINK',
      file: PASSWORDLESS_LOGIN_TEXT_TEMPLATE,
      value: link,
      fallback: 'Login: %LINK%"'
    }),
    to: user.email
  });

  return token;
}
