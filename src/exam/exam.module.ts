import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { PrismaService } from '../prisma.service';
import { JsonService } from './json.service';

@Module({
  controllers: [ExamController],
  providers: [ExamService, PrismaService, JsonService],
})
export class ExamModule {}
