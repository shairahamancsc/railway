
"use client";

import React, { createContext, useState, useEffect, ReactNode, useMemo } from "react";
import type { Labourer, Supervisor, AttendanceRecord, DailyLabourerRecord } from "@/types";

interface DataContextProps {
  labourers: Labourer[];
  addLabourer: (labourer: Omit<Labourer, "id" | "createdAt">) => void;
  updateLabourer: (labourerId: string, updatedData: Partial<Omit<Labourer, "id" | "createdAt">>) => void;
  deleteLabourer: (labourerId: string) => void;
  supervisors: Supervisor[];
  addSupervisor: (supervisor: Omit<Supervisor, "id" | "createdAt">) => void;
  attendance: AttendanceRecord[];
  markAttendance: (date: string, records: DailyLabourerRecord[], workDetails?: string) => void;
  getLabourerById: (id: string) => Labourer | undefined;
}

export const DataContext = createContext<DataContextProps | undefined>(
  undefined
);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [labourers, setLabourers] = useState<Labourer[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const labourersItem = window.localStorage.getItem("labourers");
      if (labourersItem) {
        const parsedLabourers = JSON.parse(labourersItem).map((l: any) => ({
            ...l,
            dailySalary: l.dailySalary ?? 0
        }));
        setLabourers(parsedLabourers);
      }
      
      const supervisorsItem = window.localStorage.getItem("supervisors");
      if (supervisorsItem) setSupervisors(JSON.parse(supervisorsItem));

      const attendanceItem = window.localStorage.getItem("attendance");
      if (attendanceItem) setAttendance(JSON.parse(attendanceItem));
    } catch (error) {
      console.error("Failed to parse localStorage data", error);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if(isMounted) {
      window.localStorage.setItem("labourers", JSON.stringify(labourers));
    }
  }, [labourers, isMounted]);
  
  useEffect(() => {
    if(isMounted) {
      window.localStorage.setItem("supervisors", JSON.stringify(supervisors));
    }
  }, [supervisors, isMounted]);

  useEffect(() => {
    if(isMounted) {
      window.localStorage.setItem("attendance", JSON.stringify(attendance));
    }
  }, [attendance, isMounted]);

  const addLabourer = (labourerData: Omit<Labourer, "id" | "createdAt">) => {
    const newLabourer: Labourer = {
      ...labourerData,
      id: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setLabourers((prev) => [...prev, newLabourer]);
  };

  const updateLabourer = (labourerId: string, updatedData: Partial<Omit<Labourer, "id" | "createdAt">>) => {
    setLabourers(prev => prev.map(l => l.id === labourerId ? { ...l, ...updatedData } : l));
  }
  
  const deleteLabourer = (labourerId: string) => {
    setLabourers(prev => prev.filter(l => l.id !== labourerId));
    // Also remove from attendance records
    setAttendance(prev => prev.map(att => ({
        ...att,
        records: att.records.filter(rec => rec.labourerId !== labourerId)
    })));
  }

  const addSupervisor = (supervisorData: Omit<Supervisor, "id" | "createdAt">) => {
    const newSupervisor: Supervisor = {
      ...supervisorData,
      id: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setSupervisors((prev) => [...prev, newSupervisor]);
  };

  const markAttendance = (date: string, records: DailyLabourerRecord[], workDetails?: string) => {
    setAttendance((prev) => {
      const existingRecordIndex = prev.findIndex((record) => record.date === date);
      
      const newRecord = { 
        date, 
        records,
        presentLabourerIds: records.filter(r => r.status === 'present' || r.status === 'half-day').map(r => r.labourerId),
        workDetails
      };
      
      if (existingRecordIndex > -1) {
        const updatedAttendance = [...prev];
        updatedAttendance[existingRecordIndex] = newRecord;
        return updatedAttendance;
      }
      return [...prev, newRecord];
    });
  };

  const getLabourerById = (id: string) => {
    return labourers.find(l => l.id === id);
  }

  const attendanceWithDerivedState = useMemo(() => {
    if (!attendance) return [];
    return attendance.map(att => ({
        ...att,
        presentLabourerIds: att.records?.filter(r => r.status === 'present' || r.status === 'half-day').map(r => r.labourerId) || [],
    }));
  }, [attendance]);


  if (!isMounted) {
    return null;
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
        attendance: attendanceWithDerivedState,
        markAttendance,
        getLabourerById,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

    