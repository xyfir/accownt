import { cleanEmail } from 'lib/email/clean';
import { emailToId } from 'lib/email/to-id';
import { Accownt } from 'types/accownt';
import storage from 'node-persist';

export async function checkEmail(
  email: Accownt.User['email']
): Promise<{ available: boolean }> {
  let userId: Accownt.User['id'];
  try {
    userId = await emailToId(cleanEmail(email));
  } catch (err) {}
  if (!userId) return { available: true };

  const user: Accownt.User = await storage.getItem(`user-${userId}`);
  return { available: user === undefined || !user.verified };
}
