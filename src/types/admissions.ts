export type InquiryStatus = 'NEW' | 'CONTACTED' | 'INTERESTED' | 'NOT_INTERESTED' | 'ADMITTED' | 'REJECTED';
export type InquirySource = 'WALK_IN' | 'PHONE' | 'WEBSITE' | 'FACEBOOK' | 'REFERENCE' | 'OTHER';

export interface Inquiry {
  id: number;
  inquiryNumber: string;
  studentName: string;
  parentName: string;
  phone: string;
  email: string | null;
  interestedGrade: string;
  previousSchool: string | null;
  source: InquirySource;
  status: InquiryStatus;
  notes: string | null;
  nextFollowUp: string | null;
  assignedToId: number | null;
  createdAt: string;
  updatedAt: string;
  assignedTo?: {
    id: number;
    name: string;
  } | null;
}

export interface CreateInquiryDto {
  studentName: string;
  parentName: string;
  phone: string;
  email?: string;
  interestedGrade: string;
  previousSchool?: string;
  source?: InquirySource;
  notes?: string;
  nextFollowUp?: string;
  assignedToId?: string | number;
}

export interface UpdateInquiryDto extends Partial<CreateInquiryDto> {
  status?: InquiryStatus;
}

export interface AdmitStudentDto {
  studentId: string;
  rollNumber: string;
  className: string;
  section: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  bloodGroup?: string;
  address?: string;
}
