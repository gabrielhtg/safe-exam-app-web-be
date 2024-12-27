-- CreateTable
CREATE TABLE `ExamResult` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `exam_id` INTEGER NOT NULL,
    `user_username` VARCHAR(25) NOT NULL,
    `total_score` DECIMAL(65, 30) NULL DEFAULT 0,
    `attemp` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExamAnswer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `result_id` INTEGER NOT NULL,
    `question_id` INTEGER NOT NULL,
    `answer` JSON NULL,
    `is_correct` BOOLEAN NULL DEFAULT false,
    `score` DECIMAL(65, 30) NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ExamResult` ADD CONSTRAINT `ExamResult_exam_id_fkey` FOREIGN KEY (`exam_id`) REFERENCES `Exam`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExamResult` ADD CONSTRAINT `ExamResult_user_username_fkey` FOREIGN KEY (`user_username`) REFERENCES `User`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExamAnswer` ADD CONSTRAINT `ExamAnswer_result_id_fkey` FOREIGN KEY (`result_id`) REFERENCES `ExamResult`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExamAnswer` ADD CONSTRAINT `ExamAnswer_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `Question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
