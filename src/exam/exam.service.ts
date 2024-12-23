import { HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ExamService {
  constructor(private prismaService: PrismaService) {}

  async create(createExamDto: any, res: Response) {
    const createData = await this.prismaService.exam.create({
      data: {
        title: createExamDto.title,
        start_password: createExamDto.start_password,
        start_date: createExamDto.start_date,
        end_date: createExamDto.end_date,
        submit_password: uuidv4(),
        description: createExamDto.description,
        created_by: createExamDto.created_by,
        course_title: createExamDto.course_title,
      },
    });

    return res.status(HttpStatus.OK).json({
      message: 'Exam created succesfully!',
      data: createData,
    });
  }

  async findAll(
    sortBy: string,
    order: 'asc' | 'desc',
    take: number,
    course: string,
    search: string,
    uploader: string,
    res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      message: 'ok',
      data: await this.prismaService.exam.findMany({
        where: {
          title: {
            startsWith: search,
          },
          course_title: course,
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
    return await this.prismaService.exam.findUnique({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateExamDto: any) {
    return `This action updates a #${id} exam`;
  }

  async remove(id: number, res: Response) {
    const removeData = await this.prismaService.exam.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      message: 'Exam removed succesfully!',
      data: removeData,
    });
  }
}
