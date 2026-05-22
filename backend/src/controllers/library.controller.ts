import { Request, Response } from 'express';
import prisma from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';

// --- Book Management ---

export const getBooks = asyncHandler(async (req: Request, res: Response) => {
  const books = await prisma.book.findMany({
    orderBy: { title: 'asc' },
  });
  res.status(200).json(new ApiResponse(200, books, 'Books fetched successfully'));
});

export const createBook = asyncHandler(async (req: Request, res: Response) => {
  const { title, author, isbn, publisher, category, totalCopies, location } = req.body;
  const book = await prisma.book.create({
    data: {
      title,
      author,
      isbn,
      publisher,
      category,
      totalCopies: totalCopies || 1,
      availableCopies: totalCopies || 1,
      location,
    },
  });
  res.status(201).json(new ApiResponse(201, book, 'Book created successfully'));
});

export const updateBook = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, author, isbn, publisher, category, totalCopies, availableCopies, location } = req.body;
  const book = await prisma.book.update({
    where: { id: parseInt(id) },
    data: { title, author, isbn, publisher, category, totalCopies, availableCopies, location },
  });
  res.status(200).json(new ApiResponse(200, book, 'Book updated successfully'));
});

export const deleteBook = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.book.delete({ where: { id: parseInt(id) } });
  res.status(200).json(new ApiResponse(200, null, 'Book deleted successfully'));
});

// --- Library Members ---

export const getMembers = asyncHandler(async (req: Request, res: Response) => {
  const members = await prisma.libraryMember.findMany({
    include: {
      student: { select: { fullName: true, className: true, section: true } },
      user: { select: { name: true, role: true } }
    }
  });
  res.status(200).json(new ApiResponse(200, members, 'Members fetched successfully'));
});

export const createMember = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, userId } = req.body;
  if (!studentId && !userId) {
    throw new ApiError(400, 'Either studentId or userId must be provided');
  }

  let { memberId } = req.body;

  if (studentId) {
    const existing = await prisma.libraryMember.findUnique({ where: { studentId: parseInt(studentId) } });
    if (existing) {
      throw new ApiError(400, 'Student is already a library member');
    }
  }

  if (!memberId) {
    const prefix = studentId ? 'STU' : 'USR';
    const id = studentId || userId;
    const random = Math.floor(1000 + Math.random() * 9000);
    memberId = `LIB-${prefix}-${id}-${random}`;
  }

  const member = await prisma.libraryMember.create({
    data: {
      memberId,
      studentId: studentId ? parseInt(studentId) : undefined,
      userId: userId ? parseInt(userId) : undefined,
    },
    include: {
      student: { select: { fullName: true } },
      user: { select: { name: true } }
    }
  });
  res.status(201).json(new ApiResponse(201, member, 'Member created successfully'));
});

export const deleteMember = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.libraryMember.delete({ where: { id: parseInt(id) } });
  res.status(200).json(new ApiResponse(200, null, 'Member deleted successfully'));
});

// --- Book Issues ---

export const getBookIssues = asyncHandler(async (req: Request, res: Response) => {
  const issues = await prisma.bookIssue.findMany({
    include: {
      book: { select: { title: true, isbn: true } },
      member: {
        include: {
          student: { select: { fullName: true, className: true, section: true } },
          user: { select: { name: true, role: true } }
        }
      }
    },
    orderBy: { issueDate: 'desc' }
  });
  res.status(200).json(new ApiResponse(200, issues, 'Issues fetched successfully'));
});

export const issueBook = asyncHandler(async (req: Request, res: Response) => {
  const { bookId, memberId, issueDate, dueDate } = req.body;
  
  const member = await prisma.libraryMember.findUnique({ where: { memberId: memberId } });
  if (!member || member.status !== 'ACTIVE') {
    throw new ApiError(400, 'Invalid or inactive Library Member ID');
  }

  const book = await prisma.book.findUnique({ where: { id: parseInt(bookId) } });
  if (!book || book.availableCopies <= 0) {
    throw new ApiError(400, 'Book is not available');
  }

  const result = await prisma.$transaction(async (tx) => {
    const issue = await tx.bookIssue.create({
      data: {
        bookId: parseInt(bookId),
        memberId: member.id,
        issueDate: issueDate ? new Date(issueDate) : undefined,
        dueDate: new Date(dueDate),
        status: 'ISSUED'
      },
      include: {
        book: { select: { title: true } },
        member: { include: { student: { select: { fullName: true } }, user: { select: { name: true } } } }
      }
    });

    await tx.book.update({
      where: { id: parseInt(bookId) },
      data: { availableCopies: { decrement: 1 } }
    });

    return issue;
  });

  res.status(201).json(new ApiResponse(201, result, 'Book issued successfully'));
});

export const returnBook = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { fineAmount, notes } = req.body;

  const issue = await prisma.bookIssue.findUnique({ where: { id: parseInt(id) } });
  if (!issue || issue.status === 'RETURNED') {
    throw new ApiError(400, 'Invalid or already returned issue');
  }

  const result = await prisma.$transaction(async (tx) => {
    const returned = await tx.bookIssue.update({
      where: { id: parseInt(id) },
      data: {
        status: 'RETURNED',
        returnDate: new Date(),
        fineAmount: fineAmount ? parseFloat(fineAmount) : 0,
        notes
      }
    });

    await tx.book.update({
      where: { id: issue.bookId },
      data: { availableCopies: { increment: 1 } }
    });

    return returned;
  });

  res.status(200).json(new ApiResponse(200, result, 'Book returned successfully'));
});
