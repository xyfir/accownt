import { ACCOWNT_API_URL, JWT_KEY, STORAGE, NAME } from 'constants/config';
import { sendMail } from 'lib/email/send';
import * as storage from 'node-persist';
import { Accownt } from 'types/accownt';
import * as jwt from 'jsonwebtoken';

export async function sendPasswordlessLoginEmail(
  userId: Accownt.User['id']
): Promise<void> {
  await storage.init(STORAGE);
  const user: Accownt.User = await storage.getItem(`user-${userId}`);
  if (!user.passwordless && user.password)
    throw 'Passwordless login is not enabled';

  const token: string = await new Promise((resolve, reject) =>
    jwt.sign(
      { userId: user.id, email: user.email },
      JWT_KEY,
      { expiresIn: '1h' },
      (err, token) => (err ? reject(err) : resolve(token))
    )
  );

  await sendEmail({
    subject: `${NAME} Passwordless Login`,
    text: `${ACCOWNT_API_URL}/login/passwordless?jwt=${token}`,
    to: user.email
  });
}
