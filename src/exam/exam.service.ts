import { HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import { PrismaService } from '../prisma.service';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { createCipheriv, createHash } from 'node:crypto';
import { exec } from 'node:child_process';
import * as process from 'node:process';
import { JsonService } from './json.service';
import * as util from 'node:util';
import * as os from 'node:os';

@Injectable()
export class ExamService {
  constructor(
    private prismaService: PrismaService,
    private jsonService: JsonService,
  ) {}

  async create(createExamDto: any, res: Response) {
    const createData = await this.prismaService.exam.create({
      data: {
        title: createExamDto.title,
        start_password: createExamDto.start_password,
        start_date: createExamDto.start_date,
        end_date: createExamDto.end_date,
        config_password: uuidv4(),
        description: createExamDto.description,
        created_by: createExamDto.created_by,
        course_id: +createExamDto.course_id,
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
    course: number,
    search: string,
    uploader: string,
    res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      message: 'ok',
      data: await this.prismaService.exam.findMany({
        where: {
          OR: [
            {
              title: {
                contains: search,
              },
            },
            {
              course: {
                title: {
                  contains: search,
                },
              },
            },
          ],
          course_id: course ? course : undefined,
          created_by: uploader,
        },
        include: {
          course: true,
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
          include: {
            course: true,
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
            : '',
          end_password: updateData.end_password ? updateData.end_password : '',
          config_password: updateData.config_password ? uuidv4() : undefined,
          start_date: updateData.start_date ? updateData.start_date : undefined,
          end_date: updateData.end_date ? updateData.end_date : undefined,
          sequential: updateData.sequential ? updateData.sequential : undefined,
          shuffle_options: updateData.shuffle_options,
          shuffle_questions: updateData.shuffle_questions,
          enable_review: updateData.enable_review,
          show_grade: updateData.show_grade,
          passing_grade: updateData.passing_grade
            ? updateData.passing_grade
            : undefined,
          description: updateData.description
            ? updateData.description
            : undefined,
          enable_proctoring: updateData.enable_proctoring,
          cheating_limit: updateData.cheating_limit
            ? updateData.cheating_limit
            : undefined,
          allowed_attempts: updateData.allowed_attemps
            ? updateData.allowed_attemps
            : undefined,
          time_limit: updateData.time_limit ? updateData.time_limit : undefined,
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

  async submit(resultFile: Express.Multer.File, res: Response) {
    const execPromise = util.promisify(exec);
    let sevenZipPath: string;
    if (os.platform() === 'win32') {
      sevenZipPath = path.join(process.cwd(), '7z-win', '7zr.exe');
    } else {
      sevenZipPath = path.join(process.cwd(), '7z-linux', '7zz');
    }
    const outputPath = path.join(
      process.cwd(),
      'public',
      'exam_result_file_extracted',
      resultFile.filename.split('.')[0].replaceAll(' ', '_'),
    );

    try {
      await execPromise(
        `"${sevenZipPath}" x "${resultFile.path}" -ptest -o"${outputPath}"`,
      );

      const jsonData = this.jsonService.readJsonFile(
        path.join(outputPath, 'data.json'),
      );

      const username = jsonData.username;
      const examData = jsonData.exam;
      const answerData = jsonData.answer;
      const questionsData = jsonData.questions;
      let tempTotalScore = 0;
      let tempScore = 0;
      let correctQuestion = {};
      const proctoringData = jsonData.proctoringLog;

      // fs.readdir(outputPath, (err, files) => {
      //   if (err) {
      //     console.error('Error reading directory:', err.message);
      //     return;
      //   }
      //   imageFile = files;
      //
      //   console.log(files);
      //
      //
      // });

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
              try {
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
              } catch (e: any) {
                return;
              }
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
          indicated_cheating:
            proctoringData.length >= jsonData.exam.cheating_limit,
        },
      });

      for (let i = 0; i < proctoringData.length; i++) {
        await this.prismaService.proctoringLog.create({
          data: {
            description: proctoringData[i].description,
            time: proctoringData[i].time,
            user_image:
              `exam_result_file_extracted/${resultFile.filename.split('.')[0]}/g_${proctoringData[i].image_id}.jpeg`.replaceAll(
                ' ',
                '_',
              ),
            screen_image:
              `exam_result_file_extracted/${resultFile.filename.split('.')[0]}/s_${proctoringData[i].image_id}.png`.replaceAll(
                ' ',
                '_',
              ),
            exam_result_id: createExamResultData.id,
          },
        });
      }

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
        message: `Exam submission successfully!`,
        // data: createExamResultData,
      });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: `Exam submission failed!`,
        // data: createExamResultData,
      });
    }
  }

  async findEssayAnswer(examResultId: number, res: Response) {
    try {
      const data = await this.prismaService.examAnswer.findMany({
        where: {
          result_id: examResultId,
          question: {
            type: 'essay',
          },
        },
        include: {
          question: true,
          result: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      return res.status(HttpStatus.OK).json({
        message: 'ok',
        data,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error retrieving essay answers',
        error: error.message,
      });
    }
  }

  // async gradeEssayAnswer(id: number, score: number, isCorrect: boolean) {
  //   try {
  //     // Validasi score sebelum update
  //     if (typeof score !== 'number' || score < 0) {
  //       return {
  //         status: HttpStatus.BAD_REQUEST,
  //         message: 'Invalid score value',
  //       };
  //     }

  //     const updatedAnswer = await this.prismaService.examAnswer.update({
  //       where: { id },
  //       data: {
  //         score,
  //         is_correct: isCorrect,
  //         updated_at: new Date(),
  //       },
  //     });

  //     console.log(`graded sucessfully for answer id: ${id}`)
  //     console.log(`updated data: ${updatedAnswer}`)
  //     return {
  //       status: HttpStatus.OK,
  //       message: 'Grade updated successfully',
  //       data: updatedAnswer,
  //     };
  //   } catch (error) {
  //     return {
  //       status: HttpStatus.INTERNAL_SERVER_ERROR,
  //       message: 'Failed to update grade',
  //       error: error.message,
  //     };
  //   }
  // }

  async generateExamFile(examId: number, res: Response) {
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

    const folderPath = path.dirname(filePath);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

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

    return res.status(200).json({
      message: 'success',
      data: `exam_config_file/${fileName}`,
    });
  }
}
