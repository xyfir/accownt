import * as storage from 'node-persist';
import { STORAGE } from 'constants/config';
import { Accownt } from 'types/accownt';

export async function getAccount(
  userId: Accownt.User['id']
): Promise<{
  passwordless: Accownt.User['passwordless'];
  hasPassword: boolean;
  loggedIn: boolean;
  hasTOTP: boolean;
  email: Accownt.User['email'];
}> {
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
