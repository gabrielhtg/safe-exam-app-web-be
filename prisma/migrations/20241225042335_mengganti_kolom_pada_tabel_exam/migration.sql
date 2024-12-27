/*
  Warnings:

  - You are about to drop the column `grade` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `max_score` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `random_answer` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `random_question` on the `Exam` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Exam` DROP COLUMN `grade`,
    DROP COLUMN `max_score`,
    DROP COLUMN `random_answer`,
    DROP COLUMN `random_question`,
    ADD COLUMN `enable_proctoring` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `passing_grade` DECIMAL(65, 30) NULL DEFAULT 75,
    ADD COLUMN `shuffle_options` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `shuffle_questions` BOOLEAN NOT NULL DEFAULT false;
