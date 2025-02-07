import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma.service';
import * as _ from 'lodash';

@Injectable()
export class QuestionService {
  constructor(private prismaService: PrismaService) {}

  async create(data: any, res: Response) {
    const createQuestionData = await this.prismaService.question.create({
      data: {
        content: data.content,
        type: data.type,
        point: data.remarks,
        created_by: data.created_by,
        course_id: data.course,
      },
    });

    data.options.forEach((option: any, index: number) => {
      option['id'] = `${createQuestionData.id}.${index}`;
    });

    const createOptions = await this.prismaService.question.update({
      where: {
        id: createQuestionData.id,
      },
      data: {
        options: data.options,
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
        question_data: createOptions,
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
    course_id: number,
    uploader: string,
    res: Response,
  ) {
    const getData: any = await this.prismaService.question.findMany({
      where: {
        content: {
          contains: search,
        },
        created_by: uploader,
        course_id: course_id ? course_id : undefined,
        exams: {
          every: {
            examId: exam ? exam : undefined,
          },
        },
      },
      take: take > 0 ? take : undefined,
      orderBy: {
        [sortBy]: order,
      },
      include: {
        course: true,
      },
    });

    return res.status(HttpStatus.OK).json({
      message: 'ok',
      data: getData,
    });
  }

  async findAllShuffled(exam: number, res: Response) {
    const getData: any = await this.prismaService.question.findMany({
      where: {
        exams: {
          every: {
            examId: exam,
          },
        },
      },
    });

    const shuffledOptions = getData.map((question: any) => ({
      ...question,
      options: _.shuffle(question.options),
    }));

    return res.status(HttpStatus.OK).json({
      message: 'ok',
      data: shuffledOptions,
    });
  }

  async findOne(id: number, res: Response) {
    const questionData = await this.prismaService.question.findUnique({
      where: {
        id: id,
      },
    });

    if (!questionData) {
      return res.status(400).json({
        message: 'No data',
        data: null,
      });
    }

    return res.status(200).json({
      message: 'success',
      data: questionData,
    });
  }

  async update(id: number, updateData: any, res: Response) {
    const updateResponse = await this.prismaService.question.update({
      where: {
        id: id,
      },
      data: {
        content: updateData.content,
        options: updateData.options,
        type: updateData.type,
      },
    });

    if (!updateResponse) {
      return res.status(400).json({
        message: 'Question not found!',
        data: null,
      });
    }

    return res.status(200).json({
      message: 'Question updated successfully!',
      data: updateResponse,
    });
  }

  async remove(id: number, res: Response) {
    const removeData = await this.prismaService.question.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      message: 'Question deleted successfully!',
      data: removeData,
    });
  }
}
