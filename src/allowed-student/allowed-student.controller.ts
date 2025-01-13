import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AllowedStudentService } from './allowed-student.service';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';

@Controller('allowed-student')
export class AllowedStudentController {
  constructor(private readonly allowedStudentService: AllowedStudentService) {}

  @Post()
  create(@Body() createAllowedStudentDto: any, @Res() res: Response) {
    return this.allowedStudentService.create(createAllowedStudentDto, res);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query('exam_id') examId: string, @Res() res: Response) {
    return this.allowedStudentService.findAll(+examId, res);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Res() res: Response) {
    return this.allowedStudentService.remove(+id, res);
  }
}
