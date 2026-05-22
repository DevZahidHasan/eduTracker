-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "isbn" TEXT,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "publisher" TEXT,
    "category" TEXT NOT NULL,
    "totalCopies" INTEGER NOT NULL DEFAULT 1,
    "availableCopies" INTEGER NOT NULL DEFAULT 1,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibraryMember" (
    "id" SERIAL NOT NULL,
    "memberId" TEXT NOT NULL,
    "studentId" INTEGER,
    "userId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LibraryMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookIssue" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ISSUED',
    "fineAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,

    CONSTRAINT "BookIssue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "LibraryMember_memberId_key" ON "LibraryMember"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "LibraryMember_studentId_key" ON "LibraryMember"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "LibraryMember_userId_key" ON "LibraryMember"("userId");

-- AddForeignKey
ALTER TABLE "LibraryMember" ADD CONSTRAINT "LibraryMember_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibraryMember" ADD CONSTRAINT "LibraryMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookIssue" ADD CONSTRAINT "BookIssue_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookIssue" ADD CONSTRAINT "BookIssue_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "LibraryMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
