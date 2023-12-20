import nodemailer from 'nodemailer';
import config from '../config';
export const sendMail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'mohammadsakib7679@gmail.com',
      pass: 'qqse ryym glac ugra',
    },
  });

  await transporter.sendMail({
    from: 'mohammadsakib7679@gmail.com', // sender address
    to, // list of receivers
    subject: 'Reset your password within 10 minutes!✔', // Subject line
    text: '', // plain text body
    html, // html body
  });
};
