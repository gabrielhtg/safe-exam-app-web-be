import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/model/auth.register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signup(@Body() regsiterUserDto: RegisterDto){
    return await this.authService.signUp(regsiterUserDto)
  }
}
