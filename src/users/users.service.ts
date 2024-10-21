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
      const {
        password,
        login_ip,
        created_at,
        updated_at,
        is_locked,
        id,
        ...data
      } = user;

      return res.status(HttpStatus.OK).json({
        message: 'Success',
        data: data,
      });
    }

    return res.status(HttpStatus.BAD_REQUEST).json({
      message: 'User not found',
    });
  }

  async findOneForAuth(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: username,
      },
    });

    return user;
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
}
