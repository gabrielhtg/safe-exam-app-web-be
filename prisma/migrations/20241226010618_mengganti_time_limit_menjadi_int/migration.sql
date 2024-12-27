/*
  Warnings:

  - The `time_limit` column on the `Exam` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE `Exam` DROP COLUMN `time_limit`,
    ADD COLUMN `time_limit` INTEGER NULL;
