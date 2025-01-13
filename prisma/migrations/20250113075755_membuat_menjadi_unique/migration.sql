/*
  Warnings:

  - A unique constraint covering the columns `[nim]` on the table `AllowedStudent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `AllowedStudent_nim_key` ON `AllowedStudent`(`nim`);
