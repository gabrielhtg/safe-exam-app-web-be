/*
  Warnings:

  - A unique constraint covering the columns `[submit_id]` on the table `ExamResult` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `submit_id` to the `ExamResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `examresult` ADD COLUMN `graded` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `submit_id` VARCHAR(36) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ExamResult_submit_id_key` ON `ExamResult`(`submit_id`);
