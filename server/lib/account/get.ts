import storage from 'node-persist';
import { Accownt } from 'types/accownt';

export async function getAccount(
  userId: Accownt.User['id']
): Promise<Accownt.Account> {
  if (!userId) throw 'Not logged in';
  const user: Accownt.User = await storage.getItem(`user-${userId}`);
  return {
    hasPassword: !!user.password,
    hasTOTP: !!user.totpSecret,
    email: user.email
  };
}
