require('dotenv').config();
const nodemailer = require('nodemailer');
const emailEnabledStatus = process.env.EMAIL_ENABLED === 'true' ? 'enabled' : 'disabled';

// Notify of current .env email enabled status
console.log(`Email is currently ${emailEnabledStatus} in .env file (does not affect this test)`);

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  secure: false, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

// Configure the mailoptions object
const mailOptions = {
  from: 'CubesDirect@demomailtrap.com',
  to: 'test@cubesdirect.com',
  subject: 'CubesDirect Test Email',
  text: 'If you received this email, it worked!\n\nSent using Nodemailer + Mailtrap'
};

// Send the email
console.log(`Sending email to ${mailOptions.to}...`);
transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.error(error);
  } else {
    console.log(`Email sent to ${mailOptions.to}: ${info.response}`);
  }
});