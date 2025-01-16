import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ExamResultService } from './exam-result.service';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';

@Controller('exam-result')
export class ExamResultController {
  constructor(private readonly examResultService: ExamResultService) {}

  @Post()
  create(@Body() createExamResultDto: any) {
    return this.examResultService.create(createExamResultDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query('exam') exam_id: number, @Res() res: Response) {
    return this.examResultService.findAll(exam_id, res);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    return this.examResultService.findOne(+id, res);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamResultDto: any) {
    return this.examResultService.update(+id, updateExamResultDto);
  }

  @UseGuards(AuthGuard)
  @Delete('reset')
  reset(
    @Query('exam_id') exam_id: string,
    @Query('username') username: string,
    @Res() res: Response,
  ) {
    return this.examResultService.removeAll(+exam_id, username, res);
  }
}
