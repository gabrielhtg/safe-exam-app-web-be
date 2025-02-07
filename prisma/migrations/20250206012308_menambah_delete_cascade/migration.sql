-- DropForeignKey
ALTER TABLE `exam` DROP FOREIGN KEY `Exam_course_id_fkey`;

-- AddForeignKey
ALTER TABLE `Exam` ADD CONSTRAINT `Exam_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
