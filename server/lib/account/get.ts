import * as storage from 'node-persist';
import { Accownt } from 'types/accownt';

const { STORAGE } = process.ENV;

export async function getAccount(
  userId: Accownt.User['id']
): Promise<Accownt.Account> {
  if (!userId) throw 'Not logged in';
  await storage.init(STORAGE);
  const user: Accownt.User = await storage.getItem(`user-${userId}`);
  return {
    hasPassword: !!user.password,
    hasTOTP: !!user.totpSecret,
    email: user.email
  };
}
