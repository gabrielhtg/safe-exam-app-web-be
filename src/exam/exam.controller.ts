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
import { ExamService } from './exam.service';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';

@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post()
  async create(@Body() createExamDto: any, @Res() res: Response) {
    return this.examService.create(createExamDto, res);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Query('sortBy') sortBy: string,
    @Query('orderBy') order: 'asc' | 'desc',
    @Query('take') take: string,
    @Query('search') search: string,
    @Query('course') course: string,
    @Query('uploader') uploader: string,
    @Res() res: Response,
  ) {
    return this.examService.findAll(
      sortBy,
      order,
      +take,
      course,
      search,
      uploader,
      res,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    return res.status(200).json({
      message: 'Success',
      data: await this.examService.findOne(+id, res),
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamDto: any) {
    return this.examService.update(+id, updateExamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() res: Response) {
    return this.examService.remove(+id, res);
  }
}
