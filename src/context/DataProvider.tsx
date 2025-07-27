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

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};


export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [labourers, setLabourers] = useLocalStorage<Labourer[]>("labourers", []);
  const [supervisors, setSupervisors] = useLocalStorage<Supervisor[]>("supervisors", []);
  const [attendance, setAttendance] = useLocalStorage<AttendanceRecord[]>("attendance", []);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
