-- CreateEnum
CREATE TYPE "QuestionPaperStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "correctAnswer" TEXT,
ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "options" TEXT[];

-- AlterTable
ALTER TABLE "QuestionPaper" ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "status" "QuestionPaperStatus" NOT NULL DEFAULT 'DRAFT';
