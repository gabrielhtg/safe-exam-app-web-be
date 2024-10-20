import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Res() res: Response) {
    return this.usersService.findAll(res);
  }

  @Post()
  create(@Res() res: Response, @Body() createuserDto: CreateUserDto) {
    return this.usersService.create(createuserDto, res);
  }

  @Get(':id')
  async findOne(@Param('id') username: string, @Res() res: Response) {
    const user = await this.usersService.findOne(username);

    if (user) {
      return res.status(HttpStatus.OK).json({
        message: 'Success',
        data: user,
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') username: string, @Res() res: Response) {
    const removedUser: any = await this.usersService.remove(username);

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      password,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      last_login,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      login_ip,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      is_locked,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      role,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      id,
      ...anyData
    } = removedUser;

    return res.status(HttpStatus.OK).json({
      message: `Successfully deleted user ${removedUser.username}`,
      data: anyData,
    });
  }
}
