import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { SecurityService } from '../security/security.service';

@Module({
  providers: [UsersService, PrismaService, SecurityService],
  exports: [UsersService],
})
export class UsersModule {}
