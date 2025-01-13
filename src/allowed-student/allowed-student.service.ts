import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AllowedStudentService {
  constructor(private prismaService: PrismaService) {}

  async create(createAllowedStudentDto: any, res: Response) {
    const examData = await this.prismaService.exam.findUnique({
      where: {
        id: createAllowedStudentDto.exam_id,
      },
    });

    const createData = await this.prismaService.allowedStudent.create({
      data: {
        nim: createAllowedStudentDto.nim,
        name: createAllowedStudentDto.name,
        exam_id: examData.id,
        device_id: createAllowedStudentDto.device_id,
      },
    });

    return res.status(200).json({
      message: 'Allowed Student created successfully.',
      data: createData,
    });
  }

  async findAll(examId: number, res: Response) {
    const allowedUserData = await this.prismaService.allowedStudent.findMany({
      where: {
        exam_id: examId,
      },
    });

    if (allowedUserData) {
      return res.status(200).json({
        message: 'success',
        data: allowedUserData,
      });
    } else {
      return res.status(400).json({
        message: 'Data not found!',
        data: null,
      });
    }
  }

  async remove(id: number, res: Response) {
    const removeData = await this.prismaService.allowedStudent.delete({
      where: {
        id: id,
      },
    });

    if (removeData) {
      return res.status(200).json({
        message: 'Deleted successfully!',
        data: removeData,
      });
    } else {
      return res.status(400).json({
        message: 'Data not found!',
        data: null,
      });
    }
  }
}
