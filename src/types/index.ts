export interface Labourer {
  id: string;
  profilePhotoUrl: string;
  fullName: string;
  fatherName: string;
  mobile: string;
  aadhaar: string;
  pan: string;
  dl: string;
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

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  presentLabourerIds: string[];
}
