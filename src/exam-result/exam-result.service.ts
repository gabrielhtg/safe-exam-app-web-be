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
      const answers = await this.prismaService.examAnswer.findMany({
        where: { result_id: resultId },
        include: { question: true },
      });
  
      let tempTotalScore = 0;
      let correctQuestion: any = {};
  
      answers.forEach((answer: any) => {
        const question = answer.question;
        if (!question || question.point == null) return;
  
        const maxPoint = Number(question.point);
        const options: any[] = Array.isArray(question.options) ? question.options : [];
  
        // Multiple choice
        if (question.type === 'multiple') {
          const selectedOption = options.find((option: any) => option.id === answer.answer);
          if (selectedOption && selectedOption.isCorrect) {
            tempTotalScore += maxPoint;
            correctQuestion[question.id] = maxPoint;
          }
        }
        // Checkbox
        else if (question.type === 'check-box') {
          if (Array.isArray(answer.answer)) {
            const correctOptions = options.filter((option: any) => option.isCorrect);
            const numCorrectOptions = correctOptions.length;
            answer.answer.forEach((selectedId: any) => {
              if (correctOptions.some((option: any) => option.id === selectedId)) {
                tempTotalScore += maxPoint / numCorrectOptions;
                correctQuestion[question.id] = (correctQuestion[question.id] || 0) + (maxPoint / numCorrectOptions);
              }
            });
          }
        }
        // Essay
        else if (question.type === 'essay') {
          if (answer.score !== undefined && answer.score !== null) {
            tempTotalScore += Number(answer.score);
            correctQuestion[question.id] = Number(answer.score);
          } else if (answer.is_correct) {
            tempTotalScore += maxPoint;
            correctQuestion[question.id] = maxPoint;
          }
        }
      });
  
      // Update total_score di ExamResult
      const updatedExamResult = await this.prismaService.examResult.update({
        where: { id: resultId },
        data: { total_score: tempTotalScore },
      });
  
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

  async updateGraded(resultId: number, updateGraded: boolean) {
    try {
      const update = await this.prismaService.examResult.update({
        where: { id: resultId },
        data: { graded: updateGraded },
      });
  
      console.log("Updated graded status:", update);
  
      // Hitung ulang total_score setelah status graded diubah
      await this.calculateTotalScore(resultId);
  
      return {
        status: HttpStatus.OK,
        message: 'Grading status updated successfully',
      };
    } catch (error) {
      console.error('Error updating graded status:', error);
      throw new HttpException('Failed to update grading status', HttpStatus.INTERNAL_SERVER_ERROR);
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
