import { HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SecurityService } from '../security/security.service';
import { Response } from 'express';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private securityService: SecurityService,
    private mailService: MailerService,
    private prismaService: PrismaService,
  ) {}

  async signIn(username: string, pass: string, res: Response) {
    const user = await this.usersService.findOneForAuth(username);

    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Incorrect credentials',
        data: null,
      });
    }

    if (!(await this.securityService.isMatch(user.password, pass))) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Incorrect credentials',
        data: null,
      });
    }

    const payload = { username: user.username };

    return res.status(HttpStatus.OK).json({
      message: 'Login Success!',
      data: {
        access_token: await this.jwtService.signAsync(payload),
      },
    });
  }

  async resetPassword(email: string, res: Response) {
    const newPassword = uuidv4();

    const message = `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    h2 {
      text-align: center;
      margin-bottom: 20px;
    }
    .password {
      font-size: 20px;
      font-weight: bold;
      color: #ff0000;
      text-align: center;
      margin: 20px 0;
      padding: 10px;
      background-color: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .footer {
      font-size: 12px;
      color: #666;
      text-align: center;
      margin-top: 20px;
    }
    .button {
      display: block;
      width: 200px;
      margin: 20px auto;
      padding: 10px;
      text-align: center;
      background-color: #007bff;
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
      font-size: 16px;
    }
    .button:hover {
      background-color: #0056b3;
    }
    .note {
      font-size: 14px;
      color: #555;
      text-align: center;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>HonesTest Reset Password</h2>
    <p>Hello,</p>
    <p>Your password has been successfully reset. Please use the following temporary password to log in:</p>
    <p class="password">${newPassword}</p>
    <p class="note">For security reasons, we recommend changing your password immediately after logging in.</p>
    <hr>
    <p class="footer">If you did not request this password reset, please contact our support team immediately.</p>
  </div>
</body>
</html>  
    `;

    let updateData: any;

    try {
      updateData = await this.prismaService.user.update({
        where: {
          email: email,
        },
        data: {
          password: await this.securityService.hashPassword(newPassword),
        },
      });
    } catch {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Email not found.',
        data: null,
      });
    }

    if (updateData) {
      this.mailService
        .sendMail({
          from: 'HonesTest Administrator <honestest12@gmail.com>',
          to: email,
          subject: `Reset Password`,
          html: message,
        })
        .then();

      return res.status(HttpStatus.OK).json({
        message:
          'Reset password email sent successfully. Check your email inbox',
        data: null,
      });
    } else {
      return res.status(400).json({
        message: 'Reset password failed. Email not registered!',
        data: null,
      });
    }
  }
}
