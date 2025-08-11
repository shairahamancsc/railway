
"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { Labourer, Supervisor, AttendanceRecord, DailyLabourerRecord, Settlement, ReportData, OverallTotals } from "@/types";
import { supabase } from "@/lib/supabaseClient";

interface DataContextProps {
  labourers: Labourer[];
  addLabourer: (labourerData: any) => Promise<void>;
  updateLabourer: (labourerId: string, updatedData: any) => Promise<void>;
  deleteLabourer: (labourerId: string) => Promise<void>;
  supervisors: Supervisor[];
  addSupervisor: (supervisor: Omit<Supervisor, "id" | "createdAt">) => Promise<void>;
  attendance: AttendanceRecord[];
  markAttendance: (date: string, records: DailyLabourerRecord[], workDetails?: string) => Promise<void>;
  settlements: Settlement[];
  addSettlement: (settlementData: {
    start_date: string;
    end_date: string;
    report_data: ReportData[];
    overall_totals: OverallTotals;
  }) => Promise<void>;
  adjustLoanBalance: (labourerId: string, amount: number, notes?: string) => Promise<void>;
  getLabourerById: (id: string) => Labourer | undefined;
  loading: boolean;
  error: Error | null;
}

export const DataContext = createContext<DataContextProps | undefined>(
  undefined
);

const BUCKETS = {
  PROFILE_PHOTOS: 'profile-photos',
  DOCUMENTS: 'documents'
};

const uploadFile = async (file: File, bucket: string): Promise<string | null> => {
    if (!file) return null;

    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file);

    if (error) {
        if (error.message.includes("Bucket not found")) {
            console.error(`Supabase Storage Error: Bucket "${bucket}" not found.`);
            console.error("Please create the bucket in your Supabase project dashboard under Storage > Buckets.");
            // Return null to allow the function to continue without a file URL
            return null;
        }
        console.error('Error uploading file:', error);
        throw error;
    }

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return publicUrl;
}

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [labourers, setLabourers] = useState<Labourer[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: labourersData, error: labourersError } = await supabase
        .from("labourers")
        .select("*")
        .order("fullName", { ascending: true });
      if (labourersError) throw labourersError;
      
      setLabourers(labourersData || []);

      const { data: supervisorsData, error: supervisorsError } = await supabase
        .from("supervisors")
        .select("*");
      if (supervisorsError) throw supervisorsError;
      
      const mappedSupervisors = supervisorsData?.map(s => ({
          ...s,
          createdAt: s.created_at
      })) || [];
      setSupervisors(mappedSupervisors || []);
      
      const { data: attendanceData, error: attendanceError } = await supabase
        .from("attendance")
        .select("*");
      if (attendanceError) throw attendanceError;
      
      const mappedAttendance = attendanceData?.map(a => ({
          ...a,
          presentLabourerIds: a.present_labourer_ids
      })) || [];
      setAttendance(mappedAttendance || []);

      const { data: settlementsData, error: settlementsError } = await supabase
        .from("settlements")
        .select("*")
        .order('start_date', { ascending: false });
      if (settlementsError) throw settlementsError;
      setSettlements(settlementsData || []);

    } catch (err: any) {
      console.error("Failed to fetch data from Supabase:", err.message || err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addLabourer = async (labourerData: any) => {
    const profilePhotoUrl = await uploadFile(labourerData.profilePhoto, BUCKETS.PROFILE_PHOTOS);
    const aadhaarUrl = await uploadFile(labourerData.aadhaarFile, BUCKETS.DOCUMENTS);
    const panUrl = await uploadFile(labourerData.panFile, BUCKETS.DOCUMENTS);
    const dlUrl = await uploadFile(labourerData.dlFile, BUCKETS.DOCUMENTS);

    const newLabourerData = {
      fullName: labourerData.fullName,
      daily_salary: labourerData.dailySalary,
      designation: labourerData.designation,
      profile_photo_url: profilePhotoUrl,
      face_scan_data_uri: labourerData.faceScanDataUri,
      loan_balance: 0,
      documents: {
        fatherName: labourerData.fatherName,
        mobile: labourerData.mobile,
        aadhaar: labourerData.aadhaar,
        pan: labourerData.pan,
        dl: labourerData.dl,
        aadhaarUrl: aadhaarUrl,
        panUrl: panUrl,
        dlUrl: dlUrl
      }
    };

    const { data, error: dbError } = await supabase
      .from("labourers")
      .insert([newLabourerData])
      .select()
      .single();

    if (dbError) throw dbError;

    if (data) {
        // After adding, refetch all data to maintain sorted order
        await fetchData();
    }
  };

  const updateLabourer = async (labourerId: string, updatedData: any) => {
    const profilePhotoUrl = await uploadFile(updatedData.profilePhoto, BUCKETS.PROFILE_PHOTOS);
    const aadhaarUrl = await uploadFile(updatedData.aadhaarFile, BUCKETS.DOCUMENTS);
    const panUrl = await uploadFile(updatedData.panFile, BUCKETS.DOCUMENTS);
    const dlUrl = await uploadFile(updatedData.dlFile, BUCKETS.DOCUMENTS);

    const dataToUpdate: any = {
      fullName: updatedData.fullName,
      daily_salary: updatedData.dailySalary,
      designation: updatedData.designation,
      face_scan_data_uri: updatedData.faceScanDataUri,
    };
    
    if (profilePhotoUrl) dataToUpdate.profile_photo_url = profilePhotoUrl;
    
    const existingLabourer = labourers.find(l => l.id === labourerId);
    const newDocuments = { 
        ...existingLabourer?.documents,
        fatherName: updatedData.fatherName,
        mobile: updatedData.mobile,
        aadhaar: updatedData.aadhaar,
        pan: updatedData.pan,
        dl: updatedData.dl
    };
    if (aadhaarUrl) newDocuments.aadhaarUrl = aadhaarUrl;
    if (panUrl) newDocuments.panUrl = panUrl;
    if (dlUrl) newDocuments.dlUrl = dlUrl;
    dataToUpdate.documents = newDocuments;


    const { data, error: dbError } = await supabase
      .from("labourers")
      .update(dataToUpdate)
      .eq("id", labourerId)
      .select()
      .single();

    if (dbError) throw dbError;

    if (data) {
       // After updating, refetch all data to maintain sorted order
       await fetchData();
    }
  };
  
  const deleteLabourer = async (labourerId: string) => {
    const { error } = await supabase.from("labourers").delete().eq("id", labourerId);
    if (error) throw error;
    setLabourers(prev => prev.filter(l => l.id !== labourerId));
  };

  const addSupervisor = async (supervisorData: Omit<Supervisor, "id" | "createdAt">) => {
    const { data, error } = await supabase.from("supervisors").insert([supervisorData]).select();
    if (error) throw error;
    if (data) {
      const newSupervisor = { ...data[0], createdAt: data[0].created_at };
      setSupervisors((prev) => [newSupervisor, ...prev].sort((a, b) => a.name.localeCompare(b.name)));
    }
  };

  const markAttendance = async (date: string, records: DailyLabourerRecord[], workDetails?: string) => {
     const newRecord = { 
        date, 
        records,
        work_details: workDetails,
        present_labourer_ids: records.filter(r => r.status === 'present' || r.status === 'half-day').map(r => r.labourerId)
      };
      
    const { error } = await supabase.from("attendance").upsert(newRecord, { onConflict: 'date' });
    if (error) throw error;

    setAttendance((prev) => {
      const existingRecordIndex = prev.findIndex((record) => record.date === date);
      if (existingRecordIndex > -1) {
        const updatedAttendance = [...prev];
        const updatedRecord = { 
            ...updatedAttendance[existingRecordIndex], 
            ...newRecord,
            presentLabourerIds: newRecord.present_labourer_ids
        };
        updatedAttendance[existingRecordIndex] = updatedRecord
        return updatedAttendance;
      }
      return [...prev, { ...newRecord, presentLabourerIds: newRecord.present_labourer_ids }];
    });
  };

  const addSettlement = async (settlementData: {
    start_date: string;
    end_date: string;
    report_data: ReportData[];
    overall_totals: OverallTotals;
  }) => {
    // 1. Save the settlement report
    const { data: settlement, error } = await supabase
      .from("settlements")
      .insert([settlementData])
      .select()
      .single();
  
    if (error) throw error;
  
    // 2. Update loan balances for each worker involved in the settlement
    const balanceUpdates = settlementData.report_data.map(report => {
      const loanChange = (report.newLoan || 0) - (report.loanRepayment || 0);
      return {
        id: report.labourerId,
        change: loanChange
      };
    }).filter(update => update.change !== 0);
  
    if (balanceUpdates.length > 0) {
      // Using a stored procedure would be more robust, but this works for now.
      // It iterates through each required update.
      for (const update of balanceUpdates) {
        const labourer = labourers.find(l => l.id === update.id);
        if (labourer) {
          const newBalance = (labourer.loan_balance || 0) + update.change;
          await supabase
            .from('labourers')
            .update({ loan_balance: newBalance })
            .eq('id', update.id);
        }
      }
    }
  
    // 3. Refetch labourers data to get updated balances and update state
    if (settlement) {
      setSettlements(prev => [settlement, ...prev]);
      await fetchData(); // Refetch all data to ensure consistency
    }
  };
  
  const adjustLoanBalance = async (labourerId: string, amount: number, notes?: string) => {
    // This function is for direct adjustments from the Loans page.
    const labourer = labourers.find(l => l.id === labourerId);
    if (!labourer) throw new Error("Worker not found");
  
    const newBalance = (labourer.loan_balance || 0) + amount;
  
    const { data, error } = await supabase
      .from('labourers')
      .update({ loan_balance: newBalance })
      .eq('id', labourerId)
      .select()
      .single();
  
    if (error) throw error;
  
    if (data) {
      setLabourers(prev => prev.map(l => l.id === labourerId ? data : l));
    }
    // Optionally, you could log this transaction to another table if you had one.
  };

  const getLabourerById = (id: string) => {
    return labourers.find(l => l.id === id);
  }

  return (
    <DataContext.Provider
      value={{
        labourers,
        addLabourer,
        updateLabourer,
        deleteLabourer,
        supervisors,
        addSupervisor,
        attendance,
        markAttendance,
        settlements,
        addSettlement,
        adjustLoanBalance,
        getLabourerById,
        loading,
        error
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
