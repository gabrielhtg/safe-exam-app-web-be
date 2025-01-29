/*
  Warnings:

  - You are about to drop the column `created_at` on the `ProctoringLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ProctoringLog` DROP COLUMN `created_at`,
    ADD COLUMN `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
