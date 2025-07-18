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
import axios from 'axios';

@Injectable()
export class ExamService {
  constructor(
    private prismaService: PrismaService,
    private jsonService: JsonService,
  ) {}

  generateRandomString = () => {
    const min = 0;
    const max = 9999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return `C${String(randomNumber).padStart(4, '0')}`;
  };

  async create(createExamDto: any, res: Response) {
    const tempExam = await this.prismaService.exam.findMany({
      where: {
        title: createExamDto.title,
        course_id: +createExamDto.course_id,
        created_by: createExamDto.created_by,
      },
    });

    if (tempExam.length > 0) {
      return res.status(400).json({
        message: `Exam with title ${createExamDto.title} already exists`,
        data: null,
      });
    }

    const createData = await this.prismaService.exam.create({
      data: {
        title: createExamDto.title,
        start_password: createExamDto.start_password,
        start_date: createExamDto.start_date,
        end_date: createExamDto.end_date,
        config_password: this.generateRandomString(),
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
            questions: true,
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
    const tempExam = await this.prismaService.exam.findMany({
      where: {
        title: updateData.title,
        course_id: +updateData.course_id,
        created_by: updateData.created_by,
      },
    });

    if (tempExam.length > 1) {
      return res.status(400).json({
        message: `Exam with title ${updateData.title} already exists`,
        data: null,
      });
    }

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
          config_password: updateData.config_password
            ? this.generateRandomString()
            : undefined,
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

  encodeImageToBase64(imagePath: string): string {
    try {
      const imageBuffer = fs.readFileSync(imagePath);
      return imageBuffer.toString('base64');
    } catch (error) {
      console.error(
        `Gagal membaca atau meng-encode gambar: ${imagePath}`,
        error,
      );
      throw error;
    }
  }

  async submit(req: any, resultFile: Express.Multer.File, res: Response) {
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
      if (os.platform() === 'win32') {
        await execPromise(
          `"${sevenZipPath}" x "${resultFile.path}" -p${process.env.DECRYPT_EXAM_PASSWORD} -o"${outputPath}"`,
        );
      } else {
        await execPromise(
          `7zz x "${resultFile.path}" -p${process.env.DECRYPT_EXAM_PASSWORD} -o"${outputPath}"`,
        );
      }

      const jsonData = this.jsonService.readJsonFile(
        path.join(outputPath, 'data.json'),
      );

      const username = jsonData.username;
      const examData = jsonData.exam;
      const answerData = jsonData.answer;
      const questionsData = jsonData.questions;
      const submitId = jsonData.submit_id;
      let tempTotalScore = 0;
      let tempScore = 0;
      let correctQuestion = {};
      const proctoringData = jsonData.proctoringLog;
      const hasEssay = questionsData.some((q: any) => q.type === 'essay');

      const submitByUsername = await this.prismaService.examResult.findMany({
        where: {
          exam_id: examData.id,
          user_username: username,
        },
      });

      if (submitByUsername.length >= examData.allowed_attempts) {
        return res.status(400).json({
          message: `You have reached the maximum attempt limit of ${examData.allowed_attempts} times.`,
          data: null,
        });
      }

      if (req.id === examData.id) {
        return res.status(400).json({
          message: 'Exams are not the same.',
          data: null,
        });
      }

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

      let createExamResultData: any;

      try {
        createExamResultData = await this.prismaService.examResult.create({
          data: {
            exam_id: examData.id,
            user_username: username,
            total_score: tempScore,
            expected_score: tempTotalScore,
            attempt: getExamResultData.length + 1,
            indicated_cheating:
              proctoringData.length >= jsonData.exam.cheating_limit,
            submit_id: submitId,
            graded: !hasEssay,
          },
        });
      } catch (error) {
        if (error.code === 'P2002') {
          return res.status(400).json({
            message: 'You have already submitted this exam file.',
            data: null,
          });
        }
        // return res.status(400).json({
        //   message: 'Unknown error.',
        //   data: null,
        // });
      }

      // let prompt = `Buatkan summary dari tindakan kecurangan cheating pada ujian berikut, langsung saja pada summarynya tanpa kalimat berikut adalah summarynya. Jelaskan tindakan apa yang dilakukannya dan mengapa itu dicurigai kecurangan serta apa yang dibukanya pada gambar yang saya berikan kalau ada. Berikut adalah tindakan kecurangan yang dilakukannya : \n`;
      let prompt = `Buatkan summary dari tindakan kecurangan cheating pada ujian berikut, langsung saja pada summarynya. Jelaskan tindakan apa yang dilakukannya dan mengapa. Berikut adalah tindakan kecurangan yang dilakukannya : \n`;
      // const base64ImageArray = [];

      for (let i = 0; i < proctoringData.length; i++) {
        prompt = prompt.concat(`${i + 1}. ${proctoringData[i].description}\n`);

        // try {
        //   if (
        //     proctoringData[i].description ===
        //       'The examinee was detected changing window.' &&
        //     createExamResultData.indicated_cheating
        //   ) {
        //     const fullImagePath = path.join(
        //       process.cwd(),
        //       'public',
        //       'exam_result_file_extracted',
        //       resultFile.filename.split('.')[0],
        //       `s_${proctoringData[i].image_id}.png`,
        //     );
        //
        //     base64ImageArray.push(this.encodeImageToBase64(fullImagePath));
        //   }
        // } catch (e) {
        //   // do nothing
        // }

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

      // ini nanti aktif ketika ada ditemukan cheating
      // kemudian kita buat summarynya dengan ai
      // if (createExamResultData.indicated_cheating) {
      //   (async () => {
      //     try {
      //       const response = await axios.post(
      //         `${process.env.OLLAMA_URL}/api/generate`,
      //         {
      //           model: 'gemma3:latest',
      //           stream: false,
      //           prompt: prompt,
      //           // images: base64ImageArray,
      //         },
      //       );
      //
      //       await this.prismaService.examResult.update({
      //         where: {
      //           id: createExamResultData.id,
      //         },
      //         data: {
      //           cheating_summary: response.data.response,
      //         },
      //       });
      //       console.log('Summarisasi kecurangan selesai di latar belakang.');
      //     } catch (error) {
      //       console.error(
      //         'Gagal membuat atau menyimpan summary kecurangan:',
      //         error,
      //       );
      //     }
      //   })();
      // }

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
        error,
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

      console.log('data essay answer', data);
      // if (data.length === 0) {
      //   await this.prismaService.examResult.update({
      //     where: { id: examResultId },
      //     data: { graded: true },
      //   });
      // }
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

  async findAnswer(examResultId: number, res: Response) {
    try {
      const data = await this.prismaService.examAnswer.findMany({
        where: {
          result_id: examResultId,
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

  async generateExamFile(examId: number, res: Response) {
    const examData = await this.prismaService.exam.findUnique({
      where: {
        id: examId,
      },
      include: {
        course: true,
        questions: true,
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
          some: {
            examId: examId,
          },
        },
      },
    });

    console.log(questionsData);

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
      session_id: uuidv4(),
    };

    const fileName = `${courseData.title}-${examData.title}.ta12`
      .replaceAll(' ', '_')
      .replaceAll('/', '_');
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
