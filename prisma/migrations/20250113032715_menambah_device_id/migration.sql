/*
  Warnings:

  - You are about to drop the column `exam_id` on the `AllowedStudent` table. All the data in the column will be lost.
  - Added the required column `course_id` to the `AllowedStudent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `AllowedStudent` DROP FOREIGN KEY `AllowedStudent_exam_id_fkey`;

-- AlterTable
ALTER TABLE `AllowedStudent` DROP COLUMN `exam_id`,
    ADD COLUMN `course_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `AllowedStudent` ADD CONSTRAINT `AllowedStudent_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
