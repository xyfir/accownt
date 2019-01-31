import * as storage from 'node-persist';
import { STORAGE } from 'constants/config';
import { Accownt } from 'types/accownt';

export async function getAccount(
  userId: Accownt.User['id']
): Promise<Accownt.Account> {
  if (!userId) throw 'Not logged in';
  await storage.init(STORAGE);
  const user: Accownt.User = await storage.getItem(`user-${userId}`);
  return {
    passwordless: user.passwordless,
    hasPassword: !!user.password,
    loggedIn: true,
    hasTOTP: !!user.totpSecret,
    email: user.email
  };
}
