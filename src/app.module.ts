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
import { ExamConfigModule } from './exam-config/exam-config.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
    CourseModule,
    ExamModule,
    QuestionModule,
    ExamResultModule,
    AllowedStudentModule,
    ExamConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
