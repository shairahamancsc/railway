
"use client";

import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { useData } from "@/hooks/useData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { AttendanceStatus, DailyLabourerRecord } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

type AttendanceState = Omit<DailyLabourerRecord, "labourerId">;

interface AttendanceFormProps {
  targetDate: Date;
  onSave?: () => void;
}

export function AttendanceForm({ targetDate, onSave }: AttendanceFormProps) {
  const { labourers, attendance, markAttendance } = useData();
  const { toast } = useToast();

  const dateStr = useMemo(() => format(targetDate, "yyyy-MM-dd"), [targetDate]);

  const [attendanceData, setAttendanceData] = useState<Map<string, AttendanceState>>(new Map());
  const [workDetails, setWorkDetails] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const targetAttendanceRecord = attendance.find((a) => a.date === dateStr);
    const initialData = new Map<string, AttendanceState>();

    if (labourers.length > 0) {
      labourers.forEach((labourer) => {
        const record = targetAttendanceRecord?.records?.find(
          (r) => r.labourerId === labourer.id
        );
        initialData.set(
          labourer.id,
          record || { status: "absent", advance: 0, remarks: "" }
        );
      });
    }
    setAttendanceData(initialData);
    setWorkDetails(targetAttendanceRecord?.workDetails || "");
    setIsLoaded(true);
  }, [attendance, labourers, dateStr]);

  const handleAttendanceChange = (
    labourerId: string,
    field: keyof AttendanceState,
    value: string | number
  ) => {
    setAttendanceData((prev) => {
      const newMap = new Map(prev);
      const currentRecord = newMap.get(labourerId) || {
        status: "absent",
        advance: 0,
        remarks: "",
      };
      // @ts-ignore
      currentRecord[field] = value;
      newMap.set(labourerId, currentRecord);
      return newMap;
    });
  };

  const handleSaveAttendance = () => {
    const records: DailyLabourerRecord[] = Array.from(
      attendanceData.entries()
    ).map(([labourerId, state]) => ({
      labourerId,
      ...state,
    }));
    markAttendance(dateStr, records, workDetails);
    toast({
      title: "Attendance Saved",
      description: `Attendance for ${format(targetDate, "dd MMMM, yyyy")} has been updated.`,
    });
    if (onSave) {
        onSave();
    }
  };

  if (!isLoaded) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
              <Skeleton className="h-9 w-64 mb-2" />
              <Skeleton className="h-5 w-48" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
             <Card key={i}>
                <CardHeader className="flex flex-col items-center gap-4 pb-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-headline font-bold tracking-tight">
                Mark Attendance
            </h1>
            <p className="text-muted-foreground">
                {format(targetDate, "EEEE, dd MMMM, yyyy")}
            </p>
        </div>
        {labourers.length > 0 && (
            <Button onClick={handleSaveAttendance}>Save Attendance</Button>
        )}
      </div>

      {labourers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {labourers.map((labourer) => (
              <Card key={labourer.id}>
                <CardHeader className="flex flex-col items-center gap-2 pb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={labourer.profilePhotoUrl}
                      data-ai-hint="profile person"
                    />
                    <AvatarFallback className="text-2xl">
                      {labourer.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg text-center">{labourer.fullName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                          value={
                            attendanceData.get(labourer.id)?.status || "absent"
                          }
                          onValueChange={(value: AttendanceStatus) =>
                            handleAttendanceChange(
                              labourer.id,
                              "status",
                              value
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="absent">Absent</SelectItem>
                            <SelectItem value="half-day">Half Day</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                       <AccordionItem value="advance" className="border-b-0">
                          <AccordionTrigger className="flex w-full items-center justify-center rounded-md border border-input bg-background py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground hover:no-underline">
                              <span>Advance & Remarks</span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-1 gap-4 pt-4">
                                  <div className="space-y-2">
                                      <Label htmlFor={`advance-${labourer.id}`}>Advance Amount (₹)</Label>
                                      <Input
                                        id={`advance-${labourer.id}`}
                                        type="number"
                                        placeholder="Enter amount"
                                        value={attendanceData.get(labourer.id)?.advance || ''}
                                        onChange={(e) => handleAttendanceChange(labourer.id, 'advance', e.target.valueAsNumber || 0)}
                                      />
                                  </div>
                                  <div className="space-y-2">
                                      <Label htmlFor={`remarks-${labourer.id}`}>Remarks</Label>
                                      <Textarea
                                        id={`remarks-${labourer.id}`}
                                        placeholder="Enter remarks"
                                        value={attendanceData.get(labourer.id)?.remarks || ''}
                                        onChange={(e) => handleAttendanceChange(labourer.id, 'remarks', e.target.value)}
                                      />
                                  </div>
                              </div>
                          </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Work Details for Today</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Describe the work done today..."
                value={workDetails}
                onChange={(e) => setWorkDetails(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>
        </>
      ) : (
         <Card>
            <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">
                  No workers to mark attendance for. Please add a worker first.
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}

    