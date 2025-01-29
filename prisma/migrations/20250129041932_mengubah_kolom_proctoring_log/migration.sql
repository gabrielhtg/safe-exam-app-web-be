-- DropForeignKey
ALTER TABLE `ProctoringLog` DROP FOREIGN KEY `ProctoringLog_exam_result_id_fkey`;

-- AddForeignKey
ALTER TABLE `ProctoringLog` ADD CONSTRAINT `ProctoringLog_exam_result_id_fkey` FOREIGN KEY (`exam_result_id`) REFERENCES `ExamResult`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
