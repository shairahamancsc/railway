
export type Designation = "Supervisor" | "Skilled Labour" | "Unskilled Labour" | "Driver" | "Office Incharge";

export interface Labourer {
  id: string;
  profile_photo_url: string;
  fullName: string;
  daily_salary: number;
  designation: Designation;
  group?: string;
  loan_balance: number;
  face_scan_data_uri?: string;
  documents: {
    fatherName: string;
    mobile: string;
    aadhaar: string;
    pan: string;
    dl: string;
    aadhaarUrl: string;
    panUrl: string;
    dlUrl: string;
  };
  created_at: string;
}

export interface Supervisor {
  id: string;
  name: string;
  createdAt: string;
}

export type AttendanceStatus = "present" | "absent" | "half-day";

export interface DailyLabourerRecord {
  labourerId: string;
  status: AttendanceStatus;
  advance: number;
  remarks: string;
}

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  records: DailyLabourerRecord[];
  presentLabourerIds: string[];
  workDetails?: string;
}

export interface ReportData {
  labourerId: string;
  fullName: string;
  presentDays: number;
  halfDays: number;
  totalAdvance: number;
  totalSalary: number;
  currentLoan: number;
  loanRepayment: number;
  netPayable: number;
  finalAmountPaid: number;
  newLoan: number;
  updatedLoanBalance: number;
  attendance: { [key: string]: DailyLabourerRecord | { status: 'absent' } };
}

export interface OverallTotals {
    totalGrossWages: number;
    totalAdvancePaid: number;
    totalCurrentLoans: number;
    totalLoanRepayments: number;
    totalNewLoans: number;
    totalFinalPaid: number;
}

export interface Settlement {
    id: string;
    start_date: string;
    end_date: string;
    report_data: ReportData[];
    overall_totals: OverallTotals;
    created_at: string;
}

export interface AttendanceFormProps {
  targetDate: Date;
  onSave?: () => void;
}

export interface AttendanceState {
  status: AttendanceStatus;
  advance: number;
  remarks: string;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  aiHint: string;
  content: string;
}
