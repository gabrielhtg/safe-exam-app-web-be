import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ExamResultService {
  constructor(private prismaService: PrismaService) {}

  async findAll(exam_id: number, res: Response) {
    const findAllData = await this.prismaService.examResult.findMany({
      where: {
        exam_id: +exam_id,
      },
    });

    return res.status(200).json({
      message: 'Success',
      data: findAllData,
    });
  }

  async findOne(id: number, res: Response) {
    const findData = await this.prismaService.examResult.findUnique({
      where: {
        id: +id,
      },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
        exam: true,
      },
    });

    return res.status(200).json({
      message: 'Success',
      data: findData,
    });
  }

  // update(id: number, updateExamResultDto: any) {
  //   return `This action updates a #${id} examResult`;
  // }

  remove(id: number) {
    return `This action removes a #${id} examResult`;
  }

  async removeAll(examId: number, username: string, res: Response) {
    const removeData = await this.prismaService.examResult.deleteMany({
      where: {
        exam_id: examId,
        user_username: username,
      },
    });

    return res.status(200).json({
      message: 'Reset Success',
      data: removeData,
    });
  }
}
