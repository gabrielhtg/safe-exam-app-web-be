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
    if (id) {
      return res.status(200).json({
        message: 'Success',
        data: await this.prismaService.exam.findUnique({
          where: {
            id: id,
          },
        }),
      });
    } else {
      return res.status(400).json({
        message: 'Exam ID is not defined or unknown.',
        data: null,
      });
    }
  }

  async update(id: number, updateData: any, res: Response) {
    {
      const temp = await this.prismaService.exam.update({
        where: {
          id: id,
        },
        data: {
          title: updateData.title ? updateData.title : undefined,
          start_password: updateData.start_password
            ? updateData.start_password
            : undefined,
          end_password: updateData.end_password
            ? updateData.end_password
            : undefined,
          submit_password: updateData.submit_password
            ? updateData.submit_password
            : undefined,
          start_date: updateData.start_date ? updateData.start_date : undefined,
          end_date: updateData.end_date ? updateData.end_date : undefined,
          sequential: updateData.sequential ? updateData.sequential : undefined,
          shuffle_options: updateData.shuffle_options
            ? updateData.shuffle_options
            : undefined,
          shuffle_questions: updateData.shuffle_questions
            ? updateData.shuffle_questions
            : undefined,
          enable_review: updateData.enable_review
            ? updateData.enable_review
            : undefined,
          show_grade: updateData.show_grade ? updateData.show_grade : undefined,
          passing_grade: updateData.passing_grade
            ? updateData.passing_grade
            : undefined,
          description: updateData.description
            ? updateData.description
            : undefined,
          enable_proctoring: updateData.enable_proctoring
            ? updateData.enable_proctoring
            : undefined,
          cheating_limit: updateData.cheating_limit
            ? updateData.cheating_limit
            : undefined,
          allowed_attempts: updateData.allowed_attemps
            ? updateData.allowed_attemps
            : undefined,
          time_limit: updateData.time_limit,
        },
      });

      return res.status(200).json({
        message: 'Exam updated successfully!',
        data: temp,
      });
    }
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

  async submit(submitData: any, res: Response) {
    const username = submitData.username;
    const examData = submitData.exam;
    const answerData = submitData.answer;
    const questionsData = submitData.questions;

    if (Object.keys(answerData).length === 0) {
      return res.status(400).json({
        message: 'No answers yet.',
        data: null,
      });
    }

    let tempTotalScore = 0;
    let tempScore = 0;

    let correctQuestion = {};

    questionsData.forEach((question: any) => {
      if (question.type === 'multiple') {
        question.options.forEach((option: any) => {
          if (option.id === answerData[question.id] && option.isCorrect) {
            tempScore = tempScore + +question.point;
            correctQuestion = {
              ...correctQuestion,
              [question.id]: +question.point,
            };
          }
        });
      } else if (question.type === 'check-box') {
        question.options.forEach((option: any) => {
          if (+option.id.split('.')[0] === question.id) {
            answerData[question.id].forEach((answer: any) => {
              if (answer === option.id && option.isCorrect) {
                tempScore =
                  tempScore +
                  (1 /
                    question.options.filter((tmp: any) => tmp.isCorrect)
                      .length) *
                    question.point;

                correctQuestion = {
                  ...correctQuestion,
                  [question.id]:
                    (correctQuestion[question.id]
                      ? correctQuestion[question.id]
                      : 0) +
                    (1 /
                      question.options.filter((tmp: any) => tmp.isCorrect)
                        .length) *
                      question.point,
                };
              }
            });
          }
        });
      } else {
        // console.log(answerData[question.id]);
      }

      tempTotalScore = tempTotalScore + +question.point;
    });

    const getExamResultData = await this.prismaService.examResult.findMany({
      where: {
        exam_id: examData.id,
        user_username: username,
      },
    });

    const createExamResultData = await this.prismaService.examResult.create({
      data: {
        exam_id: examData.id,
        user_username: username,
        total_score: tempScore,
        expected_score: tempTotalScore,
        attempt: getExamResultData.length + 1,
      },
    });

    for (let i = 0; i < questionsData.length; i++) {
      await this.prismaService.examAnswer.create({
        data: {
          result_id: createExamResultData.id,
          question_id: questionsData[i].id,
          answer: answerData[questionsData[i].id],
          is_correct: !!correctQuestion[questionsData[i].id],
          score: correctQuestion[questionsData[i].id],
        },
      });
    }

    return res.status(HttpStatus.OK).json({
      message: `Exam submission successfully!. Point ${tempScore} from ${tempTotalScore}. Grade ${(tempScore / tempTotalScore) * 100}`,
      data: {},
    });
  }
}
