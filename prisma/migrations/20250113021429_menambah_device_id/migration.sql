/*
  Warnings:

  - You are about to drop the `AllowedUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `device_id` to the `AllowedStudent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `AllowedUser` DROP FOREIGN KEY `AllowedUser_exam_id_fkey`;

-- AlterTable
ALTER TABLE `AllowedStudent` ADD COLUMN `device_id` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `AllowedUser`;
