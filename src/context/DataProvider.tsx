
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
    // 1. Upload files first
    const profilePhotoUrl = await uploadFile(labourerData.profilePhoto, BUCKETS.PROFILE_PHOTOS);
    const aadhaarUrl = await uploadFile(labourerData.aadhaarFile, BUCKETS.DOCUMENTS);
    const panUrl = await uploadFile(labourerData.panFile, BUCKETS.DOCUMENTS);
    const dlUrl = await uploadFile(labourerData.dlFile, BUCKETS.DOCUMENTS);

    // 2. Prepare a clean data object for Supabase with correct column names
    const newLabourerData = {
      full_name: labourerData.fullName,
      daily_salary: labourerData.dailySalary,
      designation: labourerData.designation,
      profile_photo_url: profilePhotoUrl, // Use the URL from upload
      documents: {
        fatherName: labourerData.fatherName,
        mobile: labourerData.mobile,
        aadhaar: labourerData.aadhaar,
        pan: labourerData.pan,
        dl: labourerData.dl,
        aadhaarUrl: aadhaarUrl, // Use the URL from upload
        panUrl: panUrl,         // Use the URL from upload
        dlUrl: dlUrl            // Use the URL from upload
      }
    };

    // 3. Insert the clean data into the database
    const { data, error: dbError } = await supabase
      .from("labourers")
      .insert([newLabourerData])
      .select()
      .single(); // Use .single() to get a single object back, not an array

    if (dbError) throw dbError;

    // 4. Update local state with the newly created record
    if (data) {
        const newRecord = { 
            ...data, 
            fullName: data.full_name,
            dailySalary: data.daily_salary,
            profilePhotoUrl: data.profile_photo_url,
            createdAt: data.created_at
        };
        setLabourers((prev) => [newRecord, ...prev]);
    }
  };

  const updateLabourer = async (labourerId: string, updatedData: any) => {
     // 1. Upload new files if they exist
    const profilePhotoUrl = await uploadFile(updatedData.profilePhoto, BUCKETS.PROFILE_PHOTOS);
    const aadhaarUrl = await uploadFile(updatedData.aadhaarFile, BUCKETS.DOCUMENTS);
    const panUrl = await uploadFile(updatedData.panFile, BUCKETS.DOCUMENTS);
    const dlUrl = await uploadFile(updatedData.dlFile, BUCKETS.DOCUMENTS);

    // 2. Prepare a clean data object for the update
    const dataToUpdate: any = {
      full_name: updatedData.fullName,
      daily_salary: updatedData.dailySalary,
      designation: updatedData.designation
    };
    
    // Only add profile photo URL if a new one was uploaded
    if (profilePhotoUrl) dataToUpdate.profile_photo_url = profilePhotoUrl;
    
    // Fetch existing documents to merge with new data
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


    // 3. Update the database
    const { data, error: dbError } = await supabase
      .from("labourers")
      .update(dataToUpdate)
      .eq("id", labourerId)
      .select()
      .single();

    if (dbError) throw dbError;

    // 4. Update local state
    if (data) {
       const updatedRecord = { 
           ...data, 
           fullName: data.full_name,
           dailySalary: data.daily_salary,
           profilePhotoUrl: data.profile_photo_url,
           createdAt: data.created_at
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
