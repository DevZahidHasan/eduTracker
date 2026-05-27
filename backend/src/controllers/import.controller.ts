import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import prisma from '../prisma';
import csv from 'csv-parser';
import fs from 'fs';
import { Gender } from '@prisma/client';
import bcrypt from 'bcryptjs';

/**
 * Validates and transforms a single student row
 */
const validateStudentRow = (row: any, index: number) => {
  const errors: string[] = [];
  
  if (!row.fullName) errors.push('Full Name is required');
  if (!row.className) errors.push('Class Name is required');
  if (!row.section) errors.push('Section is required');
  if (!row.rollNumber) errors.push('Roll Number is required');
  
  const gender = row.gender?.toUpperCase();
  if (!gender || !['MALE', 'FEMALE', 'OTHER'].includes(gender)) {
    errors.push('Gender must be MALE, FEMALE, or OTHER');
  }

  return {
    data: {
      studentId: row.studentId || null,
      fullName: row.fullName,
      className: row.className,
      section: row.section,
      rollNumber: String(row.rollNumber),
      gender: gender as Gender,
      email: row.email || null,
      phone: row.phone || null,
      parentName: row.parentName || null,
      parentPhone: row.parentPhone || null,
      address: row.address || null,
      bloodGroup: row.bloodGroup || null,
      dateOfBirth: row.dateOfBirth ? new Date(row.dateOfBirth) : null,
      admissionDate: row.admissionDate ? new Date(row.admissionDate) : new Date(),
    },
    errors,
    index: index + 1
  };
};

export const importStudents = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new ApiError(400, 'No CSV file uploaded');

  const results: any[] = [];
  const validRecords: any[] = [];
  const failedRecords: any[] = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(req.file!.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', resolve)
      .on('error', reject);
  });

  for (let i = 0; i < results.length; i++) {
    const { data, errors } = validateStudentRow(results[i], i);
    if (errors.length > 0) {
      failedRecords.push({ row: i + 1, errors });
      continue;
    }

    if (data.studentId) {
      const existing = await prisma.student.findUnique({ where: { studentId: data.studentId } });
      if (existing) {
        failedRecords.push({ row: i + 1, errors: [`Student ID '${data.studentId}' already exists`] });
        continue;
      }
    } else {
      const year = new Date().getFullYear();
      const count = await prisma.student.count({ where: { studentId: { startsWith: `STU-${year}` } } });
      data.studentId = `STU-${year}-${(count + validRecords.length + 1).toString().padStart(4, '0')}`;
    }

    validRecords.push(data);
  }

  let successCount = 0;
  if (validRecords.length > 0) {
    await prisma.$transaction(
      validRecords.map(record => prisma.student.create({ data: record }))
    );
    successCount = validRecords.length;
  }

  if (fs.existsSync(req.file!.path)) fs.unlinkSync(req.file!.path);

  return res.status(200).json(new ApiResponse(200, {
    total: results.length,
    success: successCount,
    failed: failedRecords.length,
    errors: failedRecords
  }, `Imported ${successCount} students successfully.`));
});

export const importStaff = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new ApiError(400, 'No CSV file uploaded');

  const results: any[] = [];
  const validRecords: any[] = [];
  const failedRecords: any[] = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(req.file!.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', resolve)
      .on('error', reject);
  });

  const defaultPassword = await bcrypt.hash('EduTracker123!', 10);

  for (let i = 0; i < results.length; i++) {
    const row = results[i];
    if (!row.email || !row.role || !row.name) {
      failedRecords.push({ row: i + 1, errors: ['Email, Name, and Role are required'] });
      continue;
    }

    const existing = await prisma.user.findUnique({ where: { email: row.email } });
    if (existing) {
      failedRecords.push({ row: i + 1, errors: [`User with email '${row.email}' already exists`] });
      continue;
    }

    validRecords.push({
      email: row.email,
      name: row.name,
      role: row.role.toUpperCase(),
      phone: row.phone || null,
      nid: row.nid || null,
      address: row.address || null,
      password: defaultPassword,
      canLogin: true
    });
  }

  if (validRecords.length > 0) {
    await prisma.user.createMany({ data: validRecords });
  }

  if (fs.existsSync(req.file!.path)) fs.unlinkSync(req.file!.path);

  return res.status(200).json(new ApiResponse(200, {
    total: results.length,
    success: validRecords.length,
    failed: failedRecords.length,
    errors: failedRecords
  }, `Imported ${validRecords.length} staff members successfully.`));
});

export const importBooks = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new ApiError(400, 'No CSV file uploaded');

  const results: any[] = [];
  const validRecords: any[] = [];
  const failedRecords: any[] = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(req.file!.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', resolve)
      .on('error', reject);
  });

  for (let i = 0; i < results.length; i++) {
    const row = results[i];
    if (!row.title || !row.author || !row.category) {
      failedRecords.push({ row: i + 1, errors: ['Title, Author, and Category are required'] });
      continue;
    }

    validRecords.push({
      title: row.title,
      author: row.author,
      category: row.category,
      isbn: row.isbn || null,
      publisher: row.publisher || null,
      totalCopies: parseInt(row.totalCopies) || 1,
      availableCopies: parseInt(row.totalCopies) || 1,
      location: row.location || null
    });
  }

  if (validRecords.length > 0) {
    await prisma.book.createMany({ data: validRecords });
  }

  if (fs.existsSync(req.file!.path)) fs.unlinkSync(req.file!.path);

  return res.status(200).json(new ApiResponse(200, {
    total: results.length,
    success: validRecords.length,
    failed: failedRecords.length,
    errors: failedRecords
  }, `Imported ${validRecords.length} books successfully.`));
});

export const getTemplates = asyncHandler(async (req: Request, res: Response) => {
  const { type } = req.params;
  
  let csvContent = "";
  switch (type) {
    case 'students':
      csvContent = "studentId,fullName,rollNumber,className,section,gender,email,dateOfBirth,bloodGroup,phone,parentName,parentPhone,address,admissionDate\n,John Doe,1,Class 1,A,MALE,john@example.com,2015-05-15,A+,1234567890,Jane Doe,0987654321,123 Street,2026-01-01";
      break;
    case 'books':
      csvContent = "title,author,isbn,publisher,category,totalCopies,location\nIntro to Science,Jane Smith,978-3-16-148410-0,Oxford,Science,5,Shelf A1";
      break;
    case 'staff':
      csvContent = "email,name,role,phone,nid,address\nteacher@school.com,Alice White,TEACHER,1122334455,NID-123,456 Lane";
      break;
    default:
      throw new ApiError(400, 'Invalid template type');
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=${type}_template.csv`);
  return res.send(csvContent);
});
