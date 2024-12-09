import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SecurityService } from '../security/security.service';
import { Response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private securityService: SecurityService,
  ) {}

  async findOne(username: string, res: Response) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: username,
      },
    });

    if (user) {
      const { password, login_ip, updated_at, is_locked, ...data } = user;

      return res.status(HttpStatus.OK).json({
        message: 'Success',
        data: data,
      });
    }

    return res.status(HttpStatus.BAD_REQUEST).json({
      message: 'User not found',
    });
  }

  async findbyEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  findOneForAuth(username: string) {
    return this.prismaService.user.findUnique({
      where: {
        username: username,
      },
    });
  }

  async changePassword(reqBody: any, res: Response) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: reqBody.username,
      },
    });

    if (!user) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'User not found',
        data: null,
      });
    }

    if (reqBody.new_password !== reqBody.re_new_password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'New password not same!',
        data: null,
      });
    }

    if (
      !(await this.securityService.isMatch(user.password, reqBody.old_password))
    ) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Incorrect credentials',
        data: null,
      });
    }

    const updateData = await this.prismaService.user.update({
      where: {
        username: reqBody.username,
      },
      data: {
        password: await this.securityService.hashPassword(reqBody.new_password),
      },
    });

    return res.status(HttpStatus.OK).json({
      message: 'Password Changed!',
      data: updateData,
    });
  }

  async findAll() {
    return this.prismaService.user.findMany();
  }

  async create(createuserDto: CreateUserDto) {
    return this.prismaService.user.create({
      data: {
        username: createuserDto.username,
        password: await this.securityService.hashPassword(
          createuserDto.password,
        ),
        email: createuserDto.email,
        name: createuserDto.name,
        created_at: new Date(),
        updated_at: new Date(),
        login_ip: '0.0.0.0',
      },
    });
  }

  async remove(username: string) {
    return this.prismaService.user.delete({
      where: {
        username: username,
      },
    });
  }

  async update(requestBody: any, file: Express.Multer.File) {
    return this.prismaService.user.update({
      where: {
        username: requestBody.old_username,
      },
      data: {
        name: requestBody.name,
        username: requestBody.username,
        email: requestBody.email,
        profile_pict: `/profile_pict/${file.filename}`,
      },
    });
  }
}
