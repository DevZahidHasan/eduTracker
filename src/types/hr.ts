export interface StaffSalary {
  userId: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
}

export interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  profileImage: string | null;
  salary: StaffSalary | null;
}

export interface LeaveRequest {
  id: number;
  userId: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  user?: {
    id: number;
    name: string;
    role: string;
  };
}

export interface PayrollRecord {
  id: string;
  userId: number;
  month: number;
  year: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  paymentDate: string;
  status: 'PAID' | 'PENDING';
  paymentMethod: string | null;
  user?: {
    id: number;
    name: string;
    role: string;
  };
}

export interface StaffAttendance {
  id: number;
  userId: number;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';
  remarks: string | null;
  user?: {
    id: number;
    name: string;
    role: string;
  };
}
