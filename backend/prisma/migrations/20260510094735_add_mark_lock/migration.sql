-- CreateTable
CREATE TABLE "MarkLock" (
    "id" SERIAL NOT NULL,
    "className" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "examType" TEXT NOT NULL,
    "lockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedBy" INTEGER NOT NULL,

    CONSTRAINT "MarkLock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarkLock_className_subject_examType_key" ON "MarkLock"("className", "subject", "examType");
