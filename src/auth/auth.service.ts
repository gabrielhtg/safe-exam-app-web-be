import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from 'src/model/auth.register.dto';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';
import { console } from 'inspector/promises';

@Injectable()
export class AuthService {
  
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.userId, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp( registerDto: RegisterDto){
    const {
      name,
      username,
      email,
      password,
      confirmPass,

    } = registerDto

    const existingUser = await this.prisma.user.findUnique({
      where:{ email},
    });

    console.log("pass: ", registerDto.password);
    console.log("confirmpass: ", registerDto.confirmPass);

    if(existingUser){
      throw new BadRequestException('Email already used');
    }

    if (password !== confirmPass){
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = await this.prisma.user.create({
      // ...registerDto,
      // password: hashedPassword,
      data: {
        name,
        username,
        email,
        password :hashedPassword,
      },
    });

    const payload = {username: newUser.username, sub: newUser.id};
    const token = this.jwtService.sign(payload);
    return{
      access_token:token,
    };
  }
}
