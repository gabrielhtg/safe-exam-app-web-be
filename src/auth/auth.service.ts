import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SecurityService } from '../security/security.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private securityService: SecurityService,
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

    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'Login Success!',
      data: {
        access_token: await this.jwtService.signAsync(payload),
      },
    });
  }
}
