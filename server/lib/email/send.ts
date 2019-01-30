import { createTransport } from 'nodemailer';
import { SMTP } from 'constants/config';

const transporter = createTransport(SMTP.TRANSPORT);

export async function sendMail(mail: {
  subject: string;
  html?: string;
  text: string;
  to: string;
}): Promise<void> {
  await transporter.sendMail({ ...SMTP.MAIL, ...mail });
}
