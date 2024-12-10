import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from '../prisma.service';
import { Response } from 'express';

@Injectable()
export class CourseService {
  constructor(private prismaService: PrismaService) {}

  async create(
    createCourseDto: CreateCourseDto,
    file: Express.Multer.File,
    res: Response,
  ) {
    const createResult = await this.prismaService.course.create({
      data: {
        title: createCourseDto.title,
        description: createCourseDto.description,
        image: `course_pict/${file.filename}`,
        created_by: createCourseDto.username,
      },
    });

    return res.status(HttpStatus.OK).json({
      message: 'Created Successfully',
      data: createResult,
    });
  }

  async findAll(res: Response) {
    return res.status(HttpStatus.OK).json({
      message: 'ok',
      data: await this.prismaService.course.findMany(),
    });
  }

  async findOne(id: number) {
    return `This action returns a #${id} course`;
  }

  async update(
    updateCourseDto: UpdateCourseDto,
    res: Response,
    file: Express.Multer.File,
  ) {
    let updateData: any | null;

    if (file !== undefined) {
      updateData = await this.prismaService.course.update({
        where: {
          title: updateCourseDto.old_title,
        },
        data: {
          title: updateCourseDto.title,
          description: updateCourseDto.description,
          image: `course_pict/${file.filename}`,
          created_by: updateCourseDto.username,
        },
      });
    } else {
      updateData = await this.prismaService.course.update({
        where: {
          title: updateCourseDto.old_title,
        },
        data: {
          title: updateCourseDto.title,
          description: updateCourseDto.description,
          created_by: updateCourseDto.username,
        },
      });
    }

    return res.status(HttpStatus.OK).json({
      message: 'Updated Successfully',
      data: updateData,
    });
  }

  async remove(id: string, res: Response) {
    const removeData = await this.prismaService.course.delete({
      where: {
        title: id,
      },
    });

    return res.status(HttpStatus.OK).json({
      message: 'Deleted Successfully!',
      data: removeData,
    });
  }
}
