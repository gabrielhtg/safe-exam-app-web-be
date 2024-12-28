import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { ExamResultService } from './exam-result.service';
import { Response } from 'express';

@Controller('exam-result')
export class ExamResultController {
  constructor(private readonly examResultService: ExamResultService) {}

  @Post()
  create(@Body() createExamResultDto: any) {
    return this.examResultService.create(createExamResultDto);
  }

  @Get()
  findAll(
    @Param('username') username: string,
    @Param('exam') exam_id: number,
    @Res() res: Response,
  ) {
    return this.examResultService.findAll(username, exam_id, res);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examResultService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamResultDto: any) {
    return this.examResultService.update(+id, updateExamResultDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.examResultService.remove(+id);
  // }

  @Delete('reset')
  reset(
    @Param('exam_id') exam_id: number,
    @Param('username') username: string,
    @Res() res: Response,
  ) {
    return this.examResultService.removeAll(exam_id, username, res);
  }
}
