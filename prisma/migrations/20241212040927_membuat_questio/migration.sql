-- DropForeignKey
ALTER TABLE `Exam` DROP FOREIGN KEY `Exam_course_title_fkey`;

-- AlterTable
ALTER TABLE `Exam` MODIFY `course_title` VARCHAR(60) NULL;

-- AddForeignKey
ALTER TABLE `Exam` ADD CONSTRAINT `Exam_course_title_fkey` FOREIGN KEY (`course_title`) REFERENCES `Course`(`title`) ON DELETE SET NULL ON UPDATE CASCADE;
