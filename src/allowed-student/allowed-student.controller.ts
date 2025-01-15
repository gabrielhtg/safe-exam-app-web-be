import {
  Controller,
  Get,
  Post,
  Body,
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
  findAll(
    @Query('sortBy') sortBy: string,
    @Query('orderBy') order: 'asc' | 'desc',
    @Query('take') take: string,
    @Query('search') search: string,
    @Query('course_id') courseId: string,
    @Res() res: Response,
  ) {
    return this.allowedStudentService.findAll(
      sortBy,
      order,
      take,
      search,
      +courseId,
      res,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Res() res: Response) {
    return this.allowedStudentService.remove(+id, res);
  }
}
