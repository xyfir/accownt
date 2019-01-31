import { cleanEmail } from 'lib/email/clean';
import { emailToId } from 'lib/email/to-id';
import * as storage from 'node-persist';
import { STORAGE } from 'constants/config';
import { Accownt } from 'types/accownt';

export async function checkEmail(
  email: Accownt.User['email']
): Promise<{ available: boolean }> {
  await storage.init(STORAGE);

  let available = true;
  try {
    const userId = await emailToId(cleanEmail(email));
    const user: Accownt.User = await storage.getItem(`user-${userId}`);
    if (user.verified) throw 'Email is not available';
  } catch (err) {
    available = false;
  }

  return { available };
}
