import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

transport.verify().then(() => {
  logger.info('Mail server connected');
});

export const sendEmail = ({ to, subject, content }) => {
  transport.sendMail({
    from: process.env.SMTP_USERNAME,
    to,
    subject,
    text: content,
  });
};
