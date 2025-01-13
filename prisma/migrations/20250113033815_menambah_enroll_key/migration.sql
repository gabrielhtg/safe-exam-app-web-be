/*
  Warnings:

  - You are about to drop the column `allowed_user_token` on the `Exam` table. All the data in the column will be lost.
  - Added the required column `enroll_key` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Course` ADD COLUMN `enroll_key` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Exam` DROP COLUMN `allowed_user_token`;
