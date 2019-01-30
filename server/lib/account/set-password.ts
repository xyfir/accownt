import * as storage from 'node-persist';
import { Accownt } from 'types/accownt';
import * as bcrypt from 'bcrypt';

export async function setPassword(
  userId: Accownt.User['id'],
  newPass: Accownt.User['password'],
  oldPass?: Accownt.User['password']
): Promise<void> {
  const user: Accownt.User = await storage.getItem(`user-${userId}`);
  if (user.password) {
    const match = await bcrypt.compare(oldPass, user.password);
    if (!match) throw 'Incorrect password';
  }
  user.password = newPass !== null ? await bcrypt.hash(newPass, 10) : null;
  await storage.setItem(`user-${userId}`, user);
}
