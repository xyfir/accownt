import { Accownt } from 'types/accownt';
import speakeasy from 'speakeasy';
import storage from 'node-persist';
import qr from 'qrcode';

const { NAME } = process.enve;

export async function setTOTP(
  userId: Accownt.User['id'],
  enabled: boolean
): Promise<{ url?: string; secret?: string }> {
  const user: Accownt.User = await storage.getItem(`user-${userId}`);

  if (!enabled) {
    user.totpSecret = null;
    await storage.setItem(`user-${userId}`, user);
    return {};
  } else {
    const { ascii: secret } = speakeasy.generateSecret({
      issuer: NAME,
      name: user.email
    });
    let url = speakeasy.otpauthURL({
      //algorithm: 'sha512',
      issuer: NAME,
      secret,
      label: `${NAME}:${encodeURIComponent(user.email)}`
    });
    url = await new Promise((resolve, reject) =>
      qr.toDataURL(url, (e, u) => (e ? reject(e) : resolve(u)))
    );

    user.totpSecret = secret;
    await storage.setItem(`user-${userId}`, user);

    return { url, secret };
  }
}
