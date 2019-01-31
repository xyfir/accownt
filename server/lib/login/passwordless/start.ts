import { ACCOWNT_API_URL, STORAGE, NAME } from 'constants/config';
import { emailToId } from 'lib/email/to-id';
import { sendMail } from 'lib/email/send';
import * as storage from 'node-persist';
import { Accownt } from 'types/accownt';
import { signJWT } from 'lib/jwt/sign';

export async function startPasswordlessLogin(
  email: Accownt.User['email']
): Promise<string> {
  const userId = await emailToId(email);
  await storage.init(STORAGE);
  const user: Accownt.User = await storage.getItem(`user-${userId}`);

  const token = await signJWT(user.id, user.email, '1h');
  await sendMail({
    subject: `${NAME} Passwordless Login`,
    text: `${ACCOWNT_API_URL}/login/passwordless?jwt=${token}`,
    to: user.email
  });

  return token;
}
