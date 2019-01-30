import * as storage from 'node-persist';
import { Accownt } from 'types/accownt';

export async function setPasswordless(
  userId: Accownt.User['id'],
  passwordless: Accownt.User['passwordless']
): Promise<void> {
  const user: Accownt.User = await storage.getItem(`user-${userId}`);
  user.passwordless = passwordless;
  await storage.setItem(`user-${userId}`, user);
}
