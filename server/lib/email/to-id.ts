import * as storage from 'node-persist';
import { STORAGE } from 'constants/config';
import { Accownt } from 'types/accownt';

export async function emailToId(
  email: Accownt.User['email']
): Promise<Accownt.User['id']> {
  await storage.init(STORAGE);
  const { userId }: { userId: Accownt.User['id'] } = await storage.getItem(
    `email-${email}`
  );
  return userId;
}
