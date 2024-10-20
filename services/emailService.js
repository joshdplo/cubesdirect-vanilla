import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  secure: false, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

export async function sendEmail({ to, subject, text, html }) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM_ADDRESS,
      to: process.env.NODE_ENV === 'production' ? to : process.env.EMAIL_TEST_ADDRESS,
      subject,
      text,
      html
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.response}`);
    return info;
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw new Error(`Unable to send email: ${error.message}`);
  }
}