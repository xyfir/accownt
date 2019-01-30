/**
 * Strip Gmail emails down to their original format to prevent multiple
 *  accounts using same email.
 */
export function cleanEmail(email: string): string {
  return /@gmail\.com$/.test(email)
    ? email
        .split('@')[0]
        .replace(/\./g, '')
        .replace(/\+.+$/, '') + '@gmail.com'
    : email;
}
