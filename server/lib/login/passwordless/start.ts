import { emailToId } from 'lib/email/to-id';
import { sendMail } from 'lib/email/send';
import * as storage from 'node-persist';
import { Accownt } from 'types/accownt';
import { signJWT } from 'lib/jwt/sign';

const { TEMP_JWT_EXPIRES_IN, ACCOWNT_API_URL, STORAGE, NAME } = process.enve;

export async function startPasswordlessLogin(
  email: Accownt.User['email']
): Promise<string> {
  const userId = await emailToId(email);
  await storage.init(STORAGE);
  const user: Accownt.User = await storage.getItem(`user-${userId}`);

  const token = await signJWT(user.id, user.email, TEMP_JWT_EXPIRES_IN);
  await sendMail({
    subject: `${NAME} Passwordless Login`,
    text: `${ACCOWNT_API_URL}/login/passwordless?jwt=${token}`,
    to: user.email
  });

  return token;
}
