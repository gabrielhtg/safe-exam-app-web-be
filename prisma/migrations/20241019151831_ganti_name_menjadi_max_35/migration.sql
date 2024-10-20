/*
  Warnings:

  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(35)`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `name` VARCHAR(35) NOT NULL;
