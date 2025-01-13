import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CourseService {
  constructor(private prismaService: PrismaService) {}

  async create(createCourseDto: any, file: Express.Multer.File, res: Response) {
    console.log(file);
    const createResult = await this.prismaService.course.create({
      data: {
        title: createCourseDto.title,
        description: createCourseDto.description,
        image: file ? `course_pict/${file.filename}` : null,
        created_by: createCourseDto.username,
        enroll_key: uuidv4(),
      },
    });

    return res.status(HttpStatus.OK).json({
      message: 'Created Successfully',
      data: createResult,
    });
  }

  async findAll(
    sortBy: string,
    order: 'asc' | 'desc',
    take: number,
    search: string,
    uploader: string,
    res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      message: 'ok',
      data: await this.prismaService.course.findMany({
        where: {
          title: {
            startsWith: search,
          },
          created_by: uploader,
        },
        take: take > 0 ? take : undefined,
        orderBy: {
          [sortBy]: order,
        },
      }),
    });
  }

  async findOne(id: number, res: Response) {
    const course = await this.prismaService.course.findUnique({
      where: {
        id: id,
      },
    });

    if (course) {
      return res.status(HttpStatus.OK).json({
        message: 'ok',
        data: course,
      });
    }

    return res.status(HttpStatus.BAD_REQUEST).json({
      message: 'Course not found',
      data: null,
    });
  }

  async update(updateCourseDto: any, res: Response, file: Express.Multer.File) {
    let updateData: any | null;

    if (file !== undefined) {
      updateData = await this.prismaService.course.update({
        where: {
          id: +updateCourseDto.id,
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
          id: +updateCourseDto.id,
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

  async remove(id: number, res: Response) {
    const removeData = await this.prismaService.course.delete({
      where: {
        id: +id,
      },
    });

    return res.status(HttpStatus.OK).json({
      message: 'Deleted Successfully!',
      data: removeData,
    });
  }

  async generateNewToken(courseId: number, res: Response) {
    const updateDAta = await this.prismaService.course.update({
      where: {
        id: courseId,
      },
      data: {
        enroll_key: uuidv4(),
      },
    });

    return res.status(200).json({
      message: 'New token generated successfully!',
      data: updateDAta,
    });
  }
}
