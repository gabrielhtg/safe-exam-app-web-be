-- DropIndex
DROP INDEX `ExamResult_user_username_fkey` ON `ExamResult`;

-- AlterTable
ALTER TABLE `ExamResult` ADD COLUMN `indicated_cheating` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `ProctoringLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(255) NOT NULL,
    `user_image` VARCHAR(255) NOT NULL,
    `screen_image` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `exam_result_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProctoringLog` ADD CONSTRAINT `ProctoringLog_exam_result_id_fkey` FOREIGN KEY (`exam_result_id`) REFERENCES `ExamResult`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
