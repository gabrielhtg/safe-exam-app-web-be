import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { SecurityService } from '../security/security.service';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService, PrismaService, SecurityService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
