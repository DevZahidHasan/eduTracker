-- AlterTable
ALTER TABLE "ExamType" ADD COLUMN     "category" TEXT DEFAULT 'FINAL',
ADD COLUMN     "termNumber" INTEGER DEFAULT 1;
