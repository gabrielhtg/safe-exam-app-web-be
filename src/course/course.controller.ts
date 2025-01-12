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
  Query,
} from '@nestjs/common';
import { CourseService } from './course.service';
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
    @Body() createCourseDto: any,
    @Res() response: Response,
  ) {
    return this.courseService.create(createCourseDto, file, response);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Query('sortBy') sortBy: string,
    @Query('orderBy') order: 'asc' | 'desc',
    @Query('take') take: string,
    @Query('search') search: string,
    @Query('uploader') uploader: string,
    @Res() res: Response,
  ) {
    return this.courseService.findAll(
      sortBy,
      order,
      +take,
      search,
      uploader,
      res,
    );
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    return this.courseService.findOne(+id, res);
  }

  @UseGuards(AuthGuard)
  @Patch()
  @UseInterceptors(FileInterceptor('course_pict', uploadCoursePict))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    updateCourseDto: any,
    @Res() res: Response,
  ) {
    return this.courseService.update(updateCourseDto, res, file);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    return this.courseService.remove(+id, res);
  }
}
