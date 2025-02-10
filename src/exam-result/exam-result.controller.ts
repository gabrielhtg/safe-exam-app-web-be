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
import { HttpStatus, HttpException } from '@nestjs/common';

@Controller('exam-result')
export class ExamResultController {
  constructor(private readonly examResultService: ExamResultService) {}

  // @Post()
  // create(@Body() createExamResultDto: any) {
  //   return this.examResultService.create(createExamResultDto);
  // }

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

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateExamResultDto: any) {
  //   return this.examResultService.update(+id, updateExamResultDto);
  // }

  @UseGuards(AuthGuard)
  @Delete('reset')
  reset(
    @Query('exam_id') exam_id: string,
    @Query('username') username: string,
    @Res() res: Response,
  ) {
    return this.examResultService.removeAll(+exam_id, username, res);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/grade')
  async gradeEssayAnswer(
    @Param('id') id: string,
    @Body() body: { score: number },
  ) {
    try {
      if (isNaN(Number(id))) {
        throw new HttpException('Invalid answer ID', HttpStatus.BAD_REQUEST);
      }
  
      if (typeof body.score !== 'number' || body.score < 0) {
        throw new HttpException('Invalid score value', HttpStatus.BAD_REQUEST);
      }
  
      const result = await this.examResultService.gradeEssayAnswer(
        Number(id),
        body.score,
      );
  
      return {
        statusCode: HttpStatus.OK,
        message: 'Grade updated successfully',
        data: result.data,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update grade',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  @UseGuards(AuthGuard)
  @Patch(':id/update-graded')
  async updateGraded(
    @Param('id') resultId: number,
    @Body('graded') updateGraded: boolean
  ) {
    try {
      const result = await this.examResultService.updateGraded(Number(resultId), updateGraded);
      return {
        status: HttpStatus.OK,
        message: 'Grading status updated successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException('Error updating grading status', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}

