-- CreateTable
CREATE TABLE "QuestionPaper" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "section" TEXT,
    "subject" TEXT NOT NULL,
    "examType" TEXT NOT NULL,
    "totalMarks" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "examDate" TIMESTAMP(3) NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionPaper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "questionPaperId" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "marks" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuestionPaper_className_subject_idx" ON "QuestionPaper"("className", "subject");

-- CreateIndex
CREATE INDEX "QuestionPaper_examDate_idx" ON "QuestionPaper"("examDate");

-- CreateIndex
CREATE INDEX "Question_questionPaperId_idx" ON "Question"("questionPaperId");

-- AddForeignKey
ALTER TABLE "QuestionPaper" ADD CONSTRAINT "QuestionPaper_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_questionPaperId_fkey" FOREIGN KEY ("questionPaperId") REFERENCES "QuestionPaper"("id") ON DELETE CASCADE ON UPDATE CASCADE;
