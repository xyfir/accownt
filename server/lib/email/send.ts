import { createTransport } from 'nodemailer';

const { SMTP_TRANSPORT, SMTP_MAIL } = process.enve;
const transporter = createTransport(SMTP_TRANSPORT);

export async function sendMail(mail: {
  subject: string;
  html?: string;
  text: string;
  to: string;
}): Promise<void> {
  await transporter.sendMail({ ...SMTP_MAIL, ...mail });
}
