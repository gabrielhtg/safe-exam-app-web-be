/*
  Warnings:

  - Added the required column `exam_id` to the `AllowedUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `AllowedUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `AllowedUser` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `exam_id` INTEGER NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `AllowedUser` ADD CONSTRAINT `AllowedUser_exam_id_fkey` FOREIGN KEY (`exam_id`) REFERENCES `Exam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
