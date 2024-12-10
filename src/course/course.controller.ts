import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadCoursePict } from '../multer.config';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('course_pict', uploadCoursePict))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createCourseDto: CreateCourseDto,
    @Res() response: Response,
  ) {
    return this.courseService.create(createCourseDto, file, response);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Res() res: Response) {
    return this.courseService.findAll(res);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.courseService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.courseService.update(+id, updateCourseDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }
}