"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import type { Labourer, Supervisor, AttendanceRecord } from "@/types";

interface DataContextProps {
  labourers: Labourer[];
  addLabourer: (labourer: Omit<Labourer, "id" | "createdAt">) => void;
  supervisors: Supervisor[];
  addSupervisor: (supervisor: Omit<Supervisor, "id" | "createdAt">) => void;
  attendance: AttendanceRecord[];
  markAttendance: (date: string, presentIds: string[]) => void;
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
      if (labourersItem) setLabourers(JSON.parse(labourersItem));
      
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

  const addSupervisor = (supervisorData: Omit<Supervisor, "id" | "createdAt">) => {
    const newSupervisor: Supervisor = {
      ...supervisorData,
      id: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setSupervisors((prev) => [...prev, newSupervisor]);
  };

  const markAttendance = (date: string, presentLabourerIds: string[]) => {
    setAttendance((prev) => {
      const existingRecordIndex = prev.findIndex((record) => record.date === date);
      if (existingRecordIndex > -1) {
        const updatedAttendance = [...prev];
        updatedAttendance[existingRecordIndex] = { date, presentLabourerIds };
        return updatedAttendance;
      }
      return [...prev, { date, presentLabourerIds }];
    });
  };

  const getLabourerById = (id: string) => {
    return labourers.find(l => l.id === id);
  }

  if (!isMounted) {
    return null;
  }

  return (
    <DataContext.Provider
      value={{
        labourers,
        addLabourer,
        supervisors,
        addSupervisor,
        attendance,
        markAttendance,
        getLabourerById,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
