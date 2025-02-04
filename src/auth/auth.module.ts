import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { SecurityService } from '../security/security.service';
import { jwtConstants } from './constants';
import { PrismaService } from '../prisma.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  controllers: [AuthController],
  providers: [AuthService, SecurityService, PrismaService],
  imports: [
    ConfigModule.forRoot(),
    UsersModule,

    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
})
export class AuthModule {}
