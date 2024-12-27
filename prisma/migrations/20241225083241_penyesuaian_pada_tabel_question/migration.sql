/*
  Warnings:

  - You are about to drop the column `show_result` on the `Exam` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Exam` DROP COLUMN `show_result`,
    ADD COLUMN `enable_review` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `show_grade` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `shuffle_options` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `shuffle_questions` BOOLEAN NOT NULL DEFAULT true;
