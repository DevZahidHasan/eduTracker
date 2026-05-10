export type Role = 'ADMIN' | 'TEACHER';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface User {
  id: number;
  email: string;
  name: string | null;
  role: Role;
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
  dateOfBirth: string | null;
  bloodGroup: string | null;
  phone: string | null;
  parentName: string | null;
  parentPhone: string | null;
  address: string | null;
  admissionDate: string;
  profileImage: string | null;
}

export interface SchoolClass {
  name: string;
}

export interface ClassSection {
  id: number;
  className: string;
  section: string;
  teacherId: number | null;
  teacher?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface Routine {
  id: number;
  classSectionId: number;
  dayOfWeek: DayOfWeek;
  periods: Period[];
}

export interface Period {
  id: number;
  routineId: number;
  subjectId: string;
  teacherId: number;
  startTime: string;
  endTime: string;
  periodNumber: number | null;
  subject?: { name: string };
  teacher?: { id: number; name: string };
}

export interface Mark {
  id: number;
  studentId: number;
  subject: string;
  examType: string;
  score: number;
  maxScore: number;
  date: string;
}

export interface Subject {
  name: string;
}

export interface ExamType {
  name: string;
}

export interface Attendance {
  id: number;
  studentId: number;
  date: string;
  status: AttendanceStatus;
}
