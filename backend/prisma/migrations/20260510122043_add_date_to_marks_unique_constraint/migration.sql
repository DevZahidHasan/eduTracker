/*
  Warnings:

  - A unique constraint covering the columns `[studentId,subject,examType,date]` on the table `Mark` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[className,subject,examType,date]` on the table `MarkLock` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Mark_studentId_subject_examType_key";

-- DropIndex
DROP INDEX "MarkLock_className_subject_examType_key";

-- AlterTable
ALTER TABLE "MarkLock" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Mark_studentId_subject_examType_date_key" ON "Mark"("studentId", "subject", "examType", "date");

-- CreateIndex
CREATE UNIQUE INDEX "MarkLock_className_subject_examType_date_key" ON "MarkLock"("className", "subject", "examType", "date");
