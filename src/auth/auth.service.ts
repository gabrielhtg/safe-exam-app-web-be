import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SecurityService } from '../security/security.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private securityService: SecurityService,
  ) {}

  async signIn(username: string, pass: string) {
    const user = await this.usersService.findOneForAuth(username);
    if (!(await this.securityService.isMatch(user.password, pass))) {
      return {
        message: 'Incorrect credentials',
        data: null,
      };
    }

    const payload = { sub: user.id, username: user.username };
    return {
      message: 'Login Success!',
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
