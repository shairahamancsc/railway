
"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { Labourer, Supervisor, AttendanceRecord, DailyLabourerRecord } from "@/types";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: labourersData, error: labourersError } = await supabase
        .from("labourers")
        .select("*");
      if (labourersError) throw labourersError;
      
      const mappedLabourers = labourersData?.map(l => ({ 
          ...l, 
          fullName: l.full_name,
          dailySalary: l.daily_salary,
          profilePhotoUrl: l.profile_photo_url,
          createdAt: l.created_at
      })) || [];
      setLabourers(mappedLabourers || []);

      const { data: supervisorsData, error: supervisorsError } = await supabase
        .from("supervisors")
        .select("*")
        .order("name", { ascending: true });
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
    const { profilePhoto, aadhaarFile, panFile, dlFile, fullName, dailySalary, ...restOfData } = labourerData;
    
    // 1. Upload files
    const profilePhotoUrl = await uploadFile(profilePhoto, BUCKETS.PROFILE_PHOTOS);
    const aadhaarUrl = await uploadFile(aadhaarFile, BUCKETS.DOCUMENTS);
    const panUrl = await uploadFile(panFile, BUCKETS.DOCUMENTS);
    const dlUrl = await uploadFile(dlFile, BUCKETS.DOCUMENTS);

    // 2. Prepare data for DB
    const newLabourer = {
      ...restOfData,
      full_name: fullName,
      daily_salary: dailySalary,
      profile_photo_url: profilePhotoUrl || "https://placehold.co/100x100.png",
      documents: {
        fatherName: restOfData.fatherName,
        mobile: restOfData.mobile,
        aadhaar: restOfData.aadhaar,
        pan: restOfData.pan,
        dl: restOfData.dl,
        aadhaarUrl: aadhaarUrl || "",
        panUrl: panUrl || "",
        dlUrl: dlUrl || "",
      },
    };
    
    delete newLabourer.fatherName;
    delete newLabourer.mobile;
    delete newLabourer.aadhaar;
    delete newLabourer.pan;
    delete newLabourer.dl;

    // 3. Insert into DB
    const { data, error: dbError } = await supabase
      .from("labourers")
      .insert([newLabourer])
      .select();

    if (dbError) throw dbError;

    // 4. Update local state
    if (data) {
        const newRecord = { 
            ...data[0], 
            fullName: data[0].full_name,
            dailySalary: data[0].daily_salary,
            profilePhotoUrl: data[0].profile_photo_url,
            createdAt: data[0].created_at
        };
        setLabourers((prev) => [newRecord, ...prev]);
    }
  };

  const updateLabourer = async (labourerId: string, updatedData: any) => {
    const { profilePhoto, aadhaarFile, panFile, dlFile, fullName, dailySalary, ...restOfData } = updatedData;
    
    // 1. Upload new files if they exist
    const profilePhotoUrl = await uploadFile(profilePhoto, BUCKETS.PROFILE_PHOTOS);
    const aadhaarUrl = await uploadFile(aadhaarFile, BUCKETS.DOCUMENTS);
    const panUrl = await uploadFile(panFile, BUCKETS.DOCUMENTS);
    const dlUrl = await uploadFile(dlFile, BUCKETS.DOCUMENTS);

    // 2. Prepare data for DB update
    const dataToUpdate: any = { 
        ...restOfData, 
        full_name: fullName,
        daily_salary: dailySalary 
    };
    if (profilePhotoUrl) dataToUpdate.profile_photo_url = profilePhotoUrl;
    
    // Fetch existing documents to merge
    const existingLabourer = labourers.find(l => l.id === labourerId);
    dataToUpdate.documents = { 
        ...existingLabourer?.documents,
        fatherName: restOfData.fatherName,
        mobile: restOfData.mobile,
        aadhaar: restOfData.aadhaar,
        pan: restOfData.pan,
        dl: restOfData.dl
    };
    if (aadhaarUrl) dataToUpdate.documents.aadhaarUrl = aadhaarUrl;
    if (panUrl) dataToUpdate.documents.panUrl = panUrl;
    if (dlUrl) dataToUpdate.documents.dlUrl = dlUrl;

    delete dataToUpdate.fatherName;
    delete dataToUpdate.mobile;
    delete dataToUpdate.aadhaar;
    delete dataToUpdate.pan;
    delete dataToUpdate.dl;

    // 3. Update DB
    const { data, error: dbError } = await supabase
      .from("labourers")
      .update(dataToUpdate)
      .eq("id", labourerId)
      .select();

    if (dbError) throw dbError;

    // 4. Update local state
    if (data) {
       const updatedRecord = { 
           ...data[0], 
           fullName: data[0].full_name,
           dailySalary: data[0].daily_salary,
           profilePhotoUrl: data[0].profile_photo_url,
           createdAt: data[0].created_at
        };
       setLabourers(prev => prev.map(l => l.id === labourerId ? updatedRecord : l));
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
      setSupervisors((prev) => [{...data[0], createdAt: data[0].created_at}, ...prev]);
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
        getLabourerById,
        loading,
        error
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
 