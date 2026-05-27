import { Request, Response } from 'express';
import prisma from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { InquiryStatus, InquirySource, Prisma } from '@prisma/client';

/**
 * Generate a unique Inquiry Number (e.g., INQ-2026-001)
 */
const generateInquiryNumber = async () => {
  const currentYear = new Date().getFullYear();
  
  // Find the last inquiry for this year
  const lastInquiry = await prisma.inquiry.findFirst({
    where: {
      inquiryNumber: {
        startsWith: `INQ-${currentYear}-`
      }
    },
    orderBy: {
      id: 'desc'
    }
  });

  if (!lastInquiry) {
    return `INQ-${currentYear}-001`;
  }

  const lastSequence = parseInt(lastInquiry.inquiryNumber.split('-')[2], 10);
  const nextSequence = (lastSequence + 1).toString().padStart(3, '0');
  
  return `INQ-${currentYear}-${nextSequence}`;
};

/**
 * @desc    Create a new admission inquiry
 * @route   POST /api/admissions/inquiries
 * @access  Private (Admin, Principal, Staff)
 */
export const createInquiry = asyncHandler(async (req: Request, res: Response) => {
  const { studentName, parentName, phone, email, interestedGrade, previousSchool, source, notes, nextFollowUp, assignedToId } = req.body;

  if (!studentName || !parentName || !phone || !interestedGrade) {
    throw new ApiError(400, 'Student Name, Parent Name, Phone, and Interested Grade are required fields');
  }

  const inquiryNumber = await generateInquiryNumber();

  const inquiry = await prisma.inquiry.create({
    data: {
      inquiryNumber,
      studentName,
      parentName,
      phone,
      email,
      interestedGrade,
      previousSchool,
      source: source || InquirySource.OTHER,
      status: InquiryStatus.NEW,
      notes,
      nextFollowUp: nextFollowUp ? new Date(nextFollowUp) : null,
      assignedToId: assignedToId ? parseInt(assignedToId, 10) : null
    },
    include: {
      assignedTo: {
        select: { id: true, name: true }
      }
    }
  });

  res.status(201).json(new ApiResponse(201, inquiry, 'Inquiry created successfully'));
});

/**
 * @desc    Get all inquiries with optional filtering
 * @route   GET /api/admissions/inquiries
 * @access  Private
 */
export const getInquiries = asyncHandler(async (req: Request, res: Response) => {
  const { status, source, assignedToId, search } = req.query;

  const where: any = {};

  if (status) where.status = status as InquiryStatus;
  if (source) where.source = source as InquirySource;
  if (assignedToId) where.assignedToId = parseInt(assignedToId as string, 10);
  
  if (search) {
    where.OR = [
      { studentName: { contains: search as string, mode: 'insensitive' } },
      { parentName: { contains: search as string, mode: 'insensitive' } },
      { phone: { contains: search as string, mode: 'insensitive' } },
      { inquiryNumber: { contains: search as string, mode: 'insensitive' } }
    ];
  }

  const inquiries = await prisma.inquiry.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      assignedTo: {
        select: { id: true, name: true }
      }
    }
  });

  res.status(200).json(new ApiResponse(200, inquiries, 'Inquiries retrieved successfully'));
});

/**
 * @desc    Get a single inquiry by ID
 * @route   GET /api/admissions/inquiries/:id
 * @access  Private
 */
export const getInquiryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const inquiry = await prisma.inquiry.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      assignedTo: {
        select: { id: true, name: true }
      }
    }
  });

  if (!inquiry) {
    throw new ApiError(404, 'Inquiry not found');
  }

  res.status(200).json(new ApiResponse(200, inquiry, 'Inquiry retrieved successfully'));
});

/**
 * @desc    Update an inquiry
 * @route   PUT /api/admissions/inquiries/:id
 * @access  Private
 */
export const updateInquiry = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes, nextFollowUp, assignedToId, studentName, parentName, phone, email, interestedGrade, previousSchool, source } = req.body;

  const existingInquiry = await prisma.inquiry.findUnique({
    where: { id: parseInt(id, 10) }
  });

  if (!existingInquiry) {
    throw new ApiError(404, 'Inquiry not found');
  }

  const updatedInquiry = await prisma.inquiry.update({
    where: { id: parseInt(id, 10) },
    data: {
      status: status as InquiryStatus,
      notes,
      nextFollowUp: nextFollowUp ? new Date(nextFollowUp) : null,
      assignedToId: assignedToId ? parseInt(assignedToId, 10) : null,
      studentName,
      parentName,
      phone,
      email,
      interestedGrade,
      previousSchool,
      source: source as InquirySource
    },
    include: {
      assignedTo: {
        select: { id: true, name: true }
      }
    }
  });

  res.status(200).json(new ApiResponse(200, updatedInquiry, 'Inquiry updated successfully'));
});

/**
 * @desc    Delete an inquiry
 * @route   DELETE /api/admissions/inquiries/:id
 * @access  Private (Admin only)
 */
export const deleteInquiry = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingInquiry = await prisma.inquiry.findUnique({
    where: { id: parseInt(id, 10) }
  });

  if (!existingInquiry) {
    throw new ApiError(404, 'Inquiry not found');
  }

  await prisma.inquiry.delete({
    where: { id: parseInt(id, 10) }
  });

  res.status(200).json(new ApiResponse(200, null, 'Inquiry deleted successfully'));
});

/**
 * @desc    Convert an Inquiry into a Student (Admit)
 * @route   POST /api/admissions/inquiries/:id/admit
 * @access  Private (Admin, Principal)
 */
export const admitInquiry = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { studentId, rollNumber, className, section, gender, dateOfBirth, bloodGroup, address, email, phone, parentName, parentPhone } = req.body;

  console.log('Admitting Inquiry:', id, { studentId, rollNumber, className, section, gender });

  // 1. Validation
  if (!studentId || !rollNumber || !className || !section || !gender) {
    throw new ApiError(400, 'Student ID, Roll Number, Class, Section, and Gender are required for admission');
  }

  const inquiry = await prisma.inquiry.findUnique({
    where: { id: parseInt(id, 10) }
  });

  if (!inquiry) {
    throw new ApiError(404, 'Inquiry not found');
  }

  if (inquiry.status === InquiryStatus.ADMITTED) {
    throw new ApiError(400, 'This inquiry has already been converted to a student');
  }

  // 2. Check for unique constraints before transaction
  const existingId = await prisma.student.findUnique({ where: { studentId } });
  if (existingId) throw new ApiError(400, `A student with ID ${studentId} already exists`);

  const studentEmail = (email || inquiry.email)?.trim() || null;

  const existingRoll = await prisma.student.findUnique({
    where: {
      className_section_rollNumber: {
        className,
        section,
        rollNumber: String(rollNumber)
      }
    }
  });
  if (existingRoll) throw new ApiError(400, `Roll number ${rollNumber} already exists in ${className} Section ${section}`);

  // 3. Verify Class and Section exist
  const classSection = await prisma.classSection.findUnique({
    where: { className_section: { className, section } }
  });
  if (!classSection) throw new ApiError(400, `The class ${className} with section ${section} does not exist. Please create it first.`);

  // 4. Conversion and Transaction
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Create the Student
      const newStudent = await tx.student.create({
        data: {
          studentId,
          fullName: req.body.fullName || inquiry.studentName,
          rollNumber: String(rollNumber),
          className,
          section,
          gender: gender as any,
          email: studentEmail,
          dateOfBirth: (dateOfBirth && dateOfBirth !== "") ? new Date(dateOfBirth) : null,
          bloodGroup: bloodGroup || null,
          phone: phone || inquiry.phone || null,
          parentName: parentName || inquiry.parentName || null,
          parentPhone: parentPhone || inquiry.phone || null,
          address: address || inquiry.previousSchool || null, // fallback to previous school if address empty
          admissionDate: new Date()
        }
      });

      // Update Inquiry Status
      await tx.inquiry.update({
        where: { id: inquiry.id },
        data: { status: InquiryStatus.ADMITTED }
      });

      return newStudent;
    });

    res.status(201).json(new ApiResponse(201, result, 'Student admitted successfully from inquiry'));
  } catch (error: any) {
    console.error('Admission Transaction Error:', error);
    if (error.code === 'P2002') {
      throw new ApiError(400, 'A unique constraint was violated (ID, Email, or Roll Number already exists)');
    }
    throw new ApiError(500, error.message || 'An unexpected error occurred during admission');
  }
});
