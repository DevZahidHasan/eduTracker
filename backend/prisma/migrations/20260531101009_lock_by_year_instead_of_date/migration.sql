/*
  Warnings:

  - You are about to drop the column `date` on the `MarkLock` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,subject,examType,year]` on the table `Mark` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[className,subject,examType,year]` on the table `MarkLock` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Mark_studentId_subject_examType_date_key";

-- DropIndex
DROP INDEX "MarkLock_className_subject_examType_date_key";

-- AlterTable
ALTER TABLE "Mark" ADD COLUMN     "year" INTEGER NOT NULL DEFAULT 2026;

-- AlterTable
ALTER TABLE "MarkLock" DROP COLUMN "date",
ADD COLUMN     "year" INTEGER NOT NULL DEFAULT 2026;

-- CreateIndex
CREATE UNIQUE INDEX "Mark_studentId_subject_examType_year_key" ON "Mark"("studentId", "subject", "examType", "year");

-- CreateIndex
CREATE UNIQUE INDEX "MarkLock_className_subject_examType_year_key" ON "MarkLock"("className", "subject", "examType", "year");
