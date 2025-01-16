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

  @UseGuards(AuthGuard)
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
      +course,
      search,
      uploader,
      res,
    );
  }

  // @UseGuards(AuthGuard)
  @Get('generate-file')
  async get(@Query('id') examId: string, @Res() res: Response) {
    return this.examService.generateExamFile(+examId, res);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    this.examService.findOne(+id, res);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: any,
    @Res() res: Response,
  ) {
    return this.examService.update(+id, updateData, res);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Res() res: Response) {
    return this.examService.remove(+id, res);
  }

  // @UseGuards(AuthGuard)
  @Post('submit')
  async submit(@Body() submitData: any, @Res() res: Response) {
    return this.examService.submit(submitData, res);
  }
}
