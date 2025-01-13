import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AllowedStudentService {
  constructor(private prismaService: PrismaService) {}

  async create(createAllowedStudentDto: any, res: Response) {
    const courseData = await this.prismaService.course.findUnique({
      where: {
        id: +createAllowedStudentDto.course_id,
      },
    });

    const beforeUser = await this.prismaService.allowedStudent.findMany({
      where: {
        nim: createAllowedStudentDto.nim,
        course_id: courseData.id,
      },
    });

    if (courseData) {
      if (courseData.enroll_key === createAllowedStudentDto.enroll_key) {
        if (beforeUser.length < 1) {
          const createData = await this.prismaService.allowedStudent.create({
            data: {
              nim: createAllowedStudentDto.nim,
              name: createAllowedStudentDto.name,
              course_id: courseData.id,
              device_id: createAllowedStudentDto.device_id,
            },
          });

          return res.status(200).json({
            message: 'Allowed Student created successfully.',
            data: createData,
          });
        } else {
          return res.status(200).json({
            message: `NIM ${createAllowedStudentDto.nim} already enrolled to this Course`,
            data: null,
          });
        }
      } else {
        return res.status(400).json({
          message: 'Wrong enroll key.',
          data: null,
        });
      }
    } else {
      return res.status(400).json({
        message: 'Course not found',
        data: null,
      });
    }
  }

  async findAll(courseId: number, res: Response) {
    const allowedUserData = await this.prismaService.allowedStudent.findMany({
      where: {
        course_id: courseId,
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
