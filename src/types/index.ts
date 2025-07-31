
export type Designation = "Supervisor" | "Skilled Labour" | "Unskilled Labour" | "Driver" | "Office Incharge";

export interface Labourer {
  id: string;
  profilePhotoUrl: string;
  fullName: string;
  fatherName: string;
  mobile: string;
  aadhaar: string;
  pan: string;
  dl: string;
  dailySalary: number;
  designation: Designation;
  documents: {
    aadhaarUrl: string;
    panUrl: string;
    dlUrl: string;
  };
  createdAt: string;
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

    
