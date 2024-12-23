/*
  Warnings:

  - Made the column `course_title` on table `Exam` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `course_title` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Exam` DROP FOREIGN KEY `Exam_course_title_fkey`;

-- AlterTable
ALTER TABLE `Exam` MODIFY `course_title` VARCHAR(60) NOT NULL;

-- AlterTable
ALTER TABLE `Question` ADD COLUMN `course_title` VARCHAR(60) NOT NULL;

-- AddForeignKey
ALTER TABLE `Exam` ADD CONSTRAINT `Exam_course_title_fkey` FOREIGN KEY (`course_title`) REFERENCES `Course`(`title`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_course_title_fkey` FOREIGN KEY (`course_title`) REFERENCES `Course`(`title`) ON DELETE RESTRICT ON UPDATE CASCADE;
