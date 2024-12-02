import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SecurityService } from '../security/security.service';
import { Response } from 'express';
import { EmailService } from 'src/emailService/email.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private securityService: SecurityService,
    private emailService: EmailService,
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

    const payload = { sub: user.id, username: user.username };

    return res.status(HttpStatus.OK).json({
      message: 'Login Success!',
      data: {
        access_token: await this.jwtService.signAsync(payload),
      },
    });
  }

  async forgotPassword(email: string): Promise<string>{
    const user = await this.usersService.findbyEmail(email);
    if(!user){
      throw new UnauthorizedException('User not Found');
    }
    const token = this.jwtService.sign({email:user.email}, {expiresIn: '15m'});

    await this.emailService.sendResetPasswordEmail(email, token);
    console.log('reset password token: ${token}');

    return 'Reset Password link has been sent to your email';
  }

  async resetPassword(token: string, newPassword: string): Promise<string>{
    console.log("verifying token...")
    const payload = this.jwtService.verify(token);
    console.log("token verified successfully:",payload)

    console.log("searching user with email:", payload.email)
    const user = await this.usersService.findbyEmail(payload.email);
    if(!user){
      console.log("user not found", payload.email)
      throw new UnauthorizedException('Invalid Token');
    }
    console.log("user:", user.email)
    // const hashPassword = await bcrypt.hash(newPassword, 10);

    console.log("updateing password with id: ", user.id)
    await this.usersService.updatePassword(user.id, newPassword);

    console.log("password update successfully")
    return "Password has been reset successfully";
  } catch(error){
    throw new UnauthorizedException('Invalid or expired token');
  }
}
