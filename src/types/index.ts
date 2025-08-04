
export type Designation = "Supervisor" | "Skilled Labour" | "Unskilled Labour" | "Driver" | "Office Incharge";

export interface Labourer {
  id: string;
  profile_photo_url: string;
  fullName: string;
  daily_salary: number;
  designation: Designation;
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
