export interface FeeType {
  id: number;
  name: string;
  isMonthly: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeeStructure {
  id: number;
  className: string;
  feeTypeId: number;
  amount: number;
  feeType?: FeeType;
}

export interface FeeVoucherItem {
  id: number;
  voucherId: string;
  feeTypeId: number;
  amount: number;
  feeType?: FeeType;
}

export interface FeeVoucher {
  id: string;
  studentId: number;
  month: number;
  year: number;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  student?: {
    fullName: string;
    studentId: string;
    className: string;
    section: string;
  };
  items?: FeeVoucherItem[];
}

export interface FinanceStats {
  totalBilled: number;
  totalCollected: number;
  totalPending: number;
  collectionRate: number;
  voucherStats: {
    total: number;
    paid: number;
    pending: number;
  };
  monthlyStats?: {
    month: string;
    collected: number;
    pending: number;
  }[];
}

export interface CreateFeeTypeData {
  name: string;
  isMonthly: boolean;
}

export interface UpsertFeeStructureData {
  className: string;
  feeTypeId: number;
  amount: number;
}

export interface GenerateVouchersData {
  className: string;
  month: number;
  year: number;
  dueDate: string;
}

export interface CollectPaymentData {
  voucherId: string;
  studentId: number;
  amount: number;
  paymentMethod: string;
  transactionId?: string;
}

export interface VoucherFilters {
  className?: string;
  status?: string;
  month?: string;
  year?: string;
}
