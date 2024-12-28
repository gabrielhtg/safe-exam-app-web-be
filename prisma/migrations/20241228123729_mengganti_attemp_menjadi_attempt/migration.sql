/*
  Warnings:

  - You are about to drop the column `allowed_attemps` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `attemp` on the `ExamResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Exam` DROP COLUMN `allowed_attemps`,
    ADD COLUMN `allowed_attempts` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `ExamResult` DROP COLUMN `attemp`,
    ADD COLUMN `attempt` INTEGER NOT NULL DEFAULT 0;
