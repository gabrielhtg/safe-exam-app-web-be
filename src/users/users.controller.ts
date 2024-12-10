import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadProfilePict } from '../multer.config';

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

  @Post('')
  @UseInterceptors(FileInterceptor('profile_pict', uploadProfilePict))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @Body() createuserDto: CreateUserDto,
  ) {
    try {
      const createdUser = await this.usersService.create(createuserDto, file);

      const { password, login_ip, created_at, updated_at, is_locked, ...data } =
        createdUser;

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

  @Get(':username')
  findOne(@Param('username') username: string, @Res() res: Response) {
    return this.usersService.findOne(username, res);
  }

  @Put()
  @UseInterceptors(FileInterceptor('profile_pict', uploadProfilePict))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Body() requestBody: any,
    @Res() res: Response,
  ) {
    const updateResult = await this.usersService.update(requestBody, file);

    return res.status(200).json({
      message: `User ${updateResult.username} updated successfully`,
      data: updateResult,
    });
  }

  @Patch('password')
  async changePassword(@Body() reqBody: any, @Res() res: Response) {
    return await this.usersService.changePassword(reqBody, res);
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
