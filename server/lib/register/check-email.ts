import { cleanEmail } from 'lib/email/clean';
import { emailToId } from 'lib/email/to-id';
import * as storage from 'node-persist';
import { STORAGE } from 'constants/config';
import { Accownt } from 'types/accownt';

export async function checkEmail(
  email: Accownt.User['email']
): Promise<{ available: boolean }> {
  await storage.init(STORAGE);

  let userId: Accownt.User['id'];
  try {
    userId = await emailToId(cleanEmail(email));
  } catch (err) {}
  if (!userId) return { available: true };

  const user: Accownt.User = await storage.getItem(`user-${userId}`);
  return { available: user === undefined || !user.verified };
}
