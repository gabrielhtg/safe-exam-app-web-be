/*
  Warnings:

  - You are about to drop the column `submit_password` on the `Exam` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Exam` DROP COLUMN `submit_password`,
    ADD COLUMN `config_password` VARCHAR(100) NULL;
