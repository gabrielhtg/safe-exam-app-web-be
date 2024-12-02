import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendResetPasswordEmail(email: string, token: string) {
    const resetLink = `https://honestest.com/reset-password?token=${token}`;
    await this.transporter.sendMail({
      from: '"HonesTest" <noreply@gmail.com>',
      to: email,
      subject: 'Reset Password',
      text: `Klik tautan berikut untuk mengatur ulang password Anda: ${resetLink}`,
    });
  }
}
