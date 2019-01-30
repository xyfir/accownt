import { ACCOWNT_API_URL, STORAGE, NAME } from 'constants/config';
import { sendMail } from 'lib/email/send';
import * as storage from 'node-persist';
import { Accownt } from 'types/accownt';
import { signJWT } from 'lib/jwt/sign';

export async function startPasswordlessLogin(
  userId: Accownt.User['id']
): Promise<void> {
  await storage.init(STORAGE);
  const user: Accownt.User = await storage.getItem(`user-${userId}`);
  if (!user.passwordless && user.password)
    throw 'Passwordless login is not enabled';

  const token = await signJWT(user.id, user.email, '1h');
  await sendEmail({
    subject: `${NAME} Passwordless Login`,
    text: `${ACCOWNT_API_URL}/login/passwordless?jwt=${token}`,
    to: user.email
  });
}
