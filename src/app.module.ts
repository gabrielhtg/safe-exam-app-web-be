import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CourseModule } from './course/course.module';
import { ExamModule } from './exam/exam.module';
import { QuestionModule } from './question/question.module';
import { ExamResultModule } from './exam-result/exam-result.module';
import { AllowedStudentModule } from './allowed-student/allowed-student.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    CourseModule,
    ExamModule,
    QuestionModule,
    ExamResultModule,
    AllowedStudentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
