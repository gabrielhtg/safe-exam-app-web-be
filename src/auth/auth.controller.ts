import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: LoginDto, @Res() res: Response) {
    return this.authService.signIn(signInDto.username, signInDto.password, res);
  }

  // @HttpCode(HttpStatus.OK)
  // @Post('forgot-password')
  // async forgotPassword(@Body('email') email: string){
  //   return await this.authService.forgotPassword(email);
  // }

  @Post('reset-password')
  async resetPassword(@Body() emailData: any, @Res() res: Response) {
    return await this.authService.resetPassword(emailData.email, res);
  }
}
