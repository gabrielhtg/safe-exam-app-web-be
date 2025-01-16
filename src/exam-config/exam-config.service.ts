import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Response } from 'express';
import { createCipheriv, createHash } from 'node:crypto';
import * as path from 'node:path';
import * as fs from 'node:fs';

@Injectable()
export class ExamConfigService {
  constructor(private prismaService: PrismaService) {}

  async downloadExamConfig(examId: number, res: Response) {
    const examData = await this.prismaService.exam.findUnique({
      where: {
        id: examId,
      },
      include: {
        course: true,
      },
    });

    if (examData.time_limit == 0 || examData.time_limit == null) {
      return res.status(400).json({
        message:
          'Cannot be generated. Determine the time limit for taking this exam.',
        data: null,
      });
    }

    const courseData = await this.prismaService.course.findUnique({
      where: {
        id: examData.course_id,
      },
    });

    const examCreatorData = await this.prismaService.user.findUnique({
      where: {
        username: examData.created_by,
      },
    });

    const allowedUserData = await this.prismaService.allowedStudent.findMany({
      where: {
        course_id: courseData.id,
      },
    });

    const questionsData = await this.prismaService.question.findMany({
      where: {
        exams: {
          every: {
            examId: examId,
          },
        },
      },
    });

    if (questionsData.length === 0) {
      return res.status(400).json({
        message:
          'Cannot be generated. Questions have not been added to this exam.',
        data: null,
      });
    }

    const fileData = {
      examData,
      courseData,
      examCreatorData,
      allowedUserData,
      questionsData,
    };

    const fileName = `${courseData.title}-${examData.title}.ta12`.replaceAll(
      ' ',
      '_',
    );
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'public/exam_config_file',
      fileName,
    );

    const key = createHash('sha256')
      .update(examData.config_password)
      .digest()
      .subarray(0, 32);
    const iv = createHash('md5').update('ta12').digest();

    const cipher = createCipheriv('aes-256-ctr', key, iv);

    const textToEncrypt = JSON.stringify(fileData);
    const encryptedText = Buffer.concat([
      cipher.update(textToEncrypt),
      cipher.final(),
    ]);

    fs.writeFileSync(filePath, encryptedText);

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    return res.status(200).send(encryptedText);
  }
}
