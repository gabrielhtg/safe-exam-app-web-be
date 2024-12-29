-- DropForeignKey
ALTER TABLE `Question` DROP FOREIGN KEY `Question_course_title_fkey`;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_course_title_fkey` FOREIGN KEY (`course_title`) REFERENCES `Course`(`title`) ON DELETE CASCADE ON UPDATE CASCADE;
