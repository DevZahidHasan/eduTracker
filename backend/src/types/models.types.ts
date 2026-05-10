import { Role, Gender, DayOfWeek, AttendanceStatus } from '@prisma/client';

export interface User {
  id: number;
  email: string;
  name: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student {
  id: number;
  studentId: string;
  fullName: string;
  rollNumber: string;
  className: string;
  section: string;
  gender: Gender;
  email: string | null;
  dateOfBirth: Date | null;
  bloodGroup: string | null;
  phone: string | null;
  parentName: string | null;
  parentPhone: string | null;
  address: string | null;
  admissionDate: Date;
  profileImage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SchoolClass {
  name: string;
}

export interface ClassSection {
  id: number;
  className: string;
  section: string;
  teacherId: number | null;
}

export interface Routine {
  id: number;
  classSectionId: number;
  dayOfWeek: DayOfWeek;
}

export interface Period {
  id: number;
  routineId: number;
  subjectId: string;
  teacherId: number;
  startTime: string;
  endTime: string;
  periodNumber: number | null;
}

export interface Mark {
  id: number;
  studentId: number;
  subject: string;
  examType: string;
  score: number;
  maxScore: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  name: string;
}

export interface ExamType {
  name: string;
  baseMark: number;
}

export interface Attendance {
  id: number;
  studentId: number;
  date: Date;
  status: AttendanceStatus;
  createdAt: Date;
  updatedAt: Date;
}
