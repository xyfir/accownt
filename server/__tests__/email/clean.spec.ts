import { cleanEmail } from 'lib/email/clean';

test('cleanEmail()', () => {
  expect(cleanEmail('e.m.a.il+test@gmail.com')).toBe('email@gmail.com');
  expect(cleanEmail('e.mail+t@example.com')).toBe('e.mail+t@example.com');
});
