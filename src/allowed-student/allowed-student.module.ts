import { Module } from '@nestjs/common';
import { AllowedStudentService } from './allowed-student.service';
import { AllowedStudentController } from './allowed-student.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AllowedStudentController],
  providers: [AllowedStudentService, PrismaService],
})
export class AllowedStudentModule {}
