import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma.service';

@Injectable()
export class QuestionService {
  constructor(private prismaService: PrismaService) {}

  async create(data: any, res: Response) {
    const createQuestionData = await this.prismaService.question.create({
      data: {
        content: data.content,
        type: data.type,
        options: data.options,
        point: data.remarks,
        created_by: data.created_by,
        course_title: data.course,
      },
    });

    const questionRelationData = await this.prismaService.examQuestion.create({
      data: {
        examId: +data.exam_id,
        questionId: createQuestionData.id,
      },
    });

    return res.status(200).json({
      message: 'Question saved successfully.',
      data: {
        question_data: createQuestionData,
        relation_data: questionRelationData,
      },
    });
  }

  async findAll(
    sortBy: string,
    order: 'asc' | 'desc',
    take: number,
    search: string,
    exam: number,
    course: string,
    uploader: string,
    res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      message: 'ok',
      data: await this.prismaService.question.findMany({
        where: {
          content: {
            contains: search,
          },
          created_by: uploader,
          course_title: course,
          exams: {
            some: {
              examId: exam,
            },
          },
        },
        take: take > 0 ? take : undefined,
        orderBy: {
          [sortBy]: order,
        },
      }),
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionDto: any) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
