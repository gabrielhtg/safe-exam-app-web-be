/*
  Warnings:

  - You are about to drop the column `correctAnswer` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Exam` ADD COLUMN `max_score` DECIMAL(65, 30) NOT NULL DEFAULT 100;

-- AlterTable
ALTER TABLE `Question` DROP COLUMN `correctAnswer`;
