/*
  Warnings:

  - You are about to drop the column `cheating_sumary` on the `ExamResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ExamResult` DROP COLUMN `cheating_sumary`,
    ADD COLUMN `cheating_summary` VARCHAR(191) NULL;
