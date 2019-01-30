import * as storage from 'node-persist';
import { STORAGE } from 'constants/config';
import { Accownt } from 'types/accownt';

export async function getAccount(
  userId: Accownt.User['id']
): Promise<{
  hasPassword: boolean;
  loggedIn: boolean;
  email: string;
}> {
  if (!userId) throw 'Not logged in';
  await storage.init(STORAGE);
  const user: Accownt.User = await storage.getItem(`user-${userId}`);
  return { loggedIn: true, hasPassword: !!user.password, email: user.email };
}
