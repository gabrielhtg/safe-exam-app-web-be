/*
  Warnings:

  - The primary key for the `Course` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `course_title` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `course_title` on the `Question` table. All the data in the column will be lost.
  - Added the required column `id` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `course_id` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `course_id` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Exam` DROP FOREIGN KEY `Exam_course_title_fkey`;

-- DropForeignKey
ALTER TABLE `Question` DROP FOREIGN KEY `Question_course_title_fkey`;

-- DropIndex
DROP INDEX `Course_title_key` ON `Course`;

-- AlterTable
ALTER TABLE `Course` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Exam` DROP COLUMN `course_title`,
    ADD COLUMN `course_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Question` DROP COLUMN `course_title`,
    ADD COLUMN `course_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Exam` ADD CONSTRAINT `Exam_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
