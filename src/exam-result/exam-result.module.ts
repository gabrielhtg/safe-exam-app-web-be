import { Module } from '@nestjs/common';
import { ExamResultService } from './exam-result.service';
import { ExamResultController } from './exam-result.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ExamResultController],
  providers: [ExamResultService, PrismaService],
})
export class ExamResultModule {}
