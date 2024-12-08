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
      const { password, login_ip, created_at, updated_at, is_locked, ...data } =
        user;

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

  // async updatePassword(userId: number, newPassword: string): Promise<void> {
  //   console.log("Trying to update password...");
  //
  //   try {
  //     const user = await this.prismaService.user.findUnique({
  //       where: { id: userId },
  //     });
  //
  //     if (!user) {
  //       console.error('User not found:', userId);
  //       throw new Error('User not found');
  //     }
  //
  //     console.log("Found user:", user.email);
  //
  //     const hashedPassword = await this.securityService.hashPassword(newPassword);
  //     console.log("Password hashed successfully");
  //
  //     await this.prismaService.user.update({
  //       where: { id: userId },
  //       data: { password: hashedPassword },
  //     });
  //
  //     console.log("Password updated successfully for user:", user.email);
  //   } catch (error) {
  //     console.error("Error updating password for userId:", userId);
  //     console.error("Error details:", error);
  //     throw new Error('Error updating password');
  //   }
  // }

  findOneForAuth(username: string) {
    return this.prismaService.user.findUnique({
      where: {
        username: username,
      },
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
}
