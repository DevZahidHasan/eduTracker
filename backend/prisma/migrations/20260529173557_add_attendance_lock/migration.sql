-- CreateTable
CREATE TABLE "AttendanceLock" (
    "id" SERIAL NOT NULL,
    "className" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "lockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedBy" INTEGER NOT NULL,

    CONSTRAINT "AttendanceLock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceLock_className_section_date_key" ON "AttendanceLock"("className", "section", "date");
