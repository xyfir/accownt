import { Accownt } from 'types/accownt';
import { signJWT } from 'lib/jwt';
import storage from 'node-persist';

const { APP_DELETE_URL } = process.enve;

export async function deleteAccount(
  userId: Accownt.User['id']
): Promise<{ url: string }> {
  if (!userId) throw 'Not logged in';
  const user: Accownt.User = await storage.getItem(`user-${userId}`);
  await storage.removeItem(`email-${user.email}`);
  await storage.removeItem(`user-${userId}`);

  const token = await signJWT(userId, user.email, '5m');
  return { url: APP_DELETE_URL.replace('%JWT%', token) };
}
