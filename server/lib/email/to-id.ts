import { Accownt } from 'types/accownt';
import storage from 'node-persist';

export async function emailToId(
  email: Accownt.User['email']
): Promise<Accownt.User['id']> {
  const userId: Accownt.User['id'] = await storage.getItem(`email-${email}`);
  if (userId === undefined) throw 'User with email does not exist';
  return userId;
}
