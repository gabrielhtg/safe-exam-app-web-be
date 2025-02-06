import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma.service';
import { HttpStatus, HttpException } from '@nestjs/common';

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
        exam: {
          include: { course: true },
        },
        proctoring_logs: true,
      },
    });

    return res.status(200).json({
      message: 'Success',
      data: findData,
    });
  }

  // update(id: number, updateExamResultDto: any) {
  //   return  `This action updates a #${id} examResult`;
  // }

  remove(id: number) {
    return `This action removes a #${id} examResult`;
  }

  async calculateTotalScore(resultId: number) {
    try {
      // Ambil semua jawaban dari ExamResult yang bersangkutan
      const answers = await this.prismaService.examAnswer.findMany({
        where: { result_id: resultId },
        include: { question: true }, // Ambil data pertanyaan untuk mendapatkan point
      });
  
      let tempTotalScore = 0;
      let correctQuestion: any = {};
  
      answers.forEach((answer: any) => {
        const question = answer.question;
  
        if (!question.point) return; // Pastikan question.point valid (ada dan angka)
  
        if (question.type === 'multiple') {
          question.options.forEach((option: any) => {
            if (answer.selectedOptionId === option.id && option.isCorrect) {
              tempTotalScore += +question.point;
              correctQuestion = {
                ...correctQuestion,
                [question.id]: (+correctQuestion[question.id] || 0) + +question.point,
              };
            }
          });
        } else if (question.type === 'essay') {
          // Untuk soal tipe essay, tambahkan nilai score dari examAnswer (jika ada)
          if (answer.score !== undefined) {
            tempTotalScore += +answer.score; // Tambahkan nilai score yang diupdate untuk soal essay
            correctQuestion = {
              ...correctQuestion,
              [question.id]: (+correctQuestion[question.id] || 0) + +answer.score,
            };
          } else if (answer.isCorrect) {
            // Jika soal essay dianggap benar tanpa update manual, tambahkan nilai dari question.point
            tempTotalScore += +question.point;
            correctQuestion = {
              ...correctQuestion,
              [question.id]: (+correctQuestion[question.id] || 0) + +question.point,
            }
          }
        } else if (question.type === 'check-box') {
          question.options.forEach((option: any) => {
            if (+option.id.split('.')[0] === question.id) {
              // Periksa jika answer.selectedAnswers ada dan sesuai dengan option.id
              if (answer.selectedAnswers && answer.selectedAnswers.includes(option.id) && option.isCorrect) {
                const correctAnswersCount = question.options.filter((tmp: any) => tmp.isCorrect).length;
                tempTotalScore += (1 / correctAnswersCount) * question.point;
                correctQuestion = {
                  ...correctQuestion,
                  [question.id]: (+correctQuestion[question.id] || 0) + (1 / correctAnswersCount) * question.point,
                };
              }
            }
          });
        }
      });
  
      // Update total_score di ExamResult
      const updatedExamResult = await this.prismaService.examResult.update({
        where: { id: resultId },
        data: { total_score: tempTotalScore },
      });
  
      console.log(`Total score recalculated for ExamResult ID: ${resultId} => ${tempTotalScore}`);
  
      return updatedExamResult;
    } catch (error) {
      console.error('Error calculating total score:', error);
      throw new HttpException('Failed to calculate total score', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async gradeEssayAnswer(id: number, score: number) {
    try {
      // Validasi score sebelum update
      if (typeof score !== 'number' || score < 0) {
        throw new HttpException('Invalid score value', HttpStatus.BAD_REQUEST);
      }
  
      // Update score dan is_correct di ExamAnswer
      const updatedAnswer = await this.prismaService.examAnswer.update({
        where: { id },
        data: { score, updated_at: new Date() },
        include: { result: true }, // Ambil data result agar bisa akses result_id
      });
  
      console.log("Updated Answer:", updatedAnswer);
      console.log(`Graded successfully for answer ID: ${id}`);
  
      // // Hitung ulang total_score di ExamResult
      // const totalScore = await this.calculateTotalScore(updatedAnswer.result_id);
      
      const checkUpdate = await this.prismaService.examAnswer.findUnique({
        where: { id },
      });
      
      console.log("Check Updated Answer:", checkUpdate);
      return {
        status: HttpStatus.OK,
        message: 'Grade updated successfully',
        data: { updatedAnswer},
      };
    } catch (error) {
      console.error('Error grading answer:', error);
      throw new HttpException('Failed to update grade', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
