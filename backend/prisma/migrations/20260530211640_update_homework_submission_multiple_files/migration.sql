/*
  Warnings:

  - You are about to drop the column `filePath` on the `HomeworkSubmission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HomeworkSubmission" DROP COLUMN "filePath",
ADD COLUMN     "filePaths" TEXT[];
