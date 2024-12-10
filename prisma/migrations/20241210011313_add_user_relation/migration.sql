/*
  Warnings:

  - Added the required column `course_title` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Exam` ADD COLUMN `course_title` VARCHAR(60) NOT NULL,
    ADD COLUMN `created_by` VARCHAR(25) NOT NULL;

-- AlterTable
ALTER TABLE `Question` ADD COLUMN `created_by` VARCHAR(25) NOT NULL;

-- AddForeignKey
ALTER TABLE `Exam` ADD CONSTRAINT `Exam_course_title_fkey` FOREIGN KEY (`course_title`) REFERENCES `Course`(`title`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exam` ADD CONSTRAINT `Exam_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `User`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `User`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;
