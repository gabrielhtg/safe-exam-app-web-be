import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { Response } from 'express';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  create(@Body() createQuestionDto: any, @Res() res: Response) {
    return this.questionService.create(createQuestionDto, res);
  }

  @Get()
  findAll(
    @Query('sortBy') sortBy: string,
    @Query('orderBy') order: 'asc' | 'desc',
    @Query('take') take: string,
    @Query('search') search: string,
    @Query('exam') exam: string,
    @Query('course') course: string,
    @Query('uploader') uploader: string,
    @Res() res: Response,
  ) {
    return this.questionService.findAll(
      sortBy,
      order,
      +take,
      search,
      +exam,
      +course,
      uploader,
      res,
    );
  }

  @Get('shuffled')
  findAllShuffled(@Query('exam') exam: string, @Res() res: Response) {
    return this.questionService.findAllShuffled(+exam, res);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: any,
    @Res() res: Response,
  ) {
    return this.questionService.update(+id, updateData, res);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() res: Response) {
    return this.questionService.remove(+id, res);
  }
}
