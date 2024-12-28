import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ExamResultService {
  constructor(private prismaService: PrismaService) {}

  create(createExamResultDto: any) {
    return 'This action adds a new examResult';
  }

  async findAll(username: string, exam_id: number, res: Response) {
    const findAllData = await this.prismaService.examResult.findMany({
      where: {
        user_username: username,
        exam_id: exam_id,
      },
    });

    return res.status(200).json({
      message: 'Success',
      data: findAllData,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} examResult`;
  }

  update(id: number, updateExamResultDto: any) {
    return `This action updates a #${id} examResult`;
  }

  remove(id: number) {
    return `This action removes a #${id} examResult`;
  }

  async removeAll(examId: number, username: string, res: Response) {
    console.log(examId);
    console.log(username);
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
