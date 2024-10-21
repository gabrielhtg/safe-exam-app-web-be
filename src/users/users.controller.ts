import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Res() res: Response) {
    const users = await this.usersService.findAll();

    if (users.length > 0) {
      return res.status(200).json({
        message: 'ok',
        data: users,
      });
    } else {
      return res.status(404).json({
        message: 'No Data',
        data: null,
      });
    }
  }

  @Post()
  async create(@Res() res: Response, @Body() createuserDto: CreateUserDto) {
    try {
      const createdUser = await this.usersService.create(createuserDto);

      const {
        password,
        login_ip,
        created_at,
        updated_at,
        is_locked,
        id,
        ...data
      } = createdUser;

      if (createdUser) {
        return res.status(200).json({
          message: 'User created successfully',
          data: data,
        });
      }
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          return res.status(HttpStatus.BAD_REQUEST).json({
            message: `Unique constraint violation: ${createuserDto.username} already exists`,
          });
        }
      }
    }

    return res.status(HttpStatus.BAD_REQUEST).json({
      message: 'Bad Request',
      data: [],
    });
  }

  @Get(':id')
  findOne(@Param('id') username: string, @Res() res: Response) {
    return this.usersService.findOne(username, res);
  }

  @Delete(':id')
  async remove(@Param('id') username: string, @Res() res: Response) {
    try {
      const removedUser: any = await this.usersService.remove(username);

      const {
        password,
        last_login,
        login_ip,
        is_locked,
        role,
        id,
        ...anyData
      } = removedUser;

      return res.status(HttpStatus.OK).json({
        message: `Successfully deleted user ${removedUser.username}`,
        data: anyData,
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'User not found!',
          data: null,
        });
      }
    }
  }
}
