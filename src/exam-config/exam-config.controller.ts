import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ExamConfigService } from './exam-config.service';
import { Response } from 'express';

@Controller('exam-config')
export class ExamConfigController {
  constructor(private readonly examConfigService: ExamConfigService) {}

  @Get(':id')
  async get(@Param('id') examId: string, @Res() res: Response) {
    console.log('mama');
    return this.examConfigService.downloadExamConfig(+examId, res);
  }
}
