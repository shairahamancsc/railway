"use client";

import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { useData } from "@/hooks/useData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type AttendanceState = Omit<DailyLabourerRecord, "labourerId">;

export default function AttendancePage() {
  const { labourers, attendance, markAttendance } = useData();
  const { toast } = useToast();
  const todayStr = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

  const [attendanceData, setAttendanceData] = useState<
    Map<string, AttendanceState>
  >(new Map());

  useEffect(() => {
    const todayAttendanceRecord = attendance.find((a) => a.date === todayStr);
    const initialData = new Map<string, AttendanceState>();

    labourers.forEach((labourer) => {
      const record = todayAttendanceRecord?.records?.find(
        (r) => r.labourerId === labourer.id
      );
      initialData.set(
        labourer.id,
        record || { status: "absent", advance: 0, remarks: "" }
      );
    });
    setAttendanceData(initialData);
  }, [attendance, labourers, todayStr]);

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
    markAttendance(todayStr, records);
    toast({
      title: "Attendance Saved",
      description: `Attendance for ${format(
        new Date(),
        "MMMM dd, yyyy"
      )} has been updated.`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-headline font-bold tracking-tight">
                Mark Attendance
            </h1>
            <p className="text-muted-foreground">
                {format(new Date(), "EEEE, MMMM dd, yyyy")}
            </p>
        </div>
        {labourers.length > 0 && (
            <Button onClick={handleSaveAttendance}>Save Attendance</Button>
        )}
      </div>

      {labourers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {labourers.map((labourer) => (
            <Card key={labourer.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src={labourer.profilePhotoUrl}
                      data-ai-hint="profile person"
                    />
                    <AvatarFallback>
                      {labourer.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg">{labourer.fullName}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
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

                    <AccordionItem value="advance" className="border-t pt-4">
                        <AccordionTrigger>
                            <h4 className="font-medium">Advance & Remarks</h4>
                        </AccordionTrigger>
                        <AccordionContent>
                           <div className="grid grid-cols-1 gap-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`advance-${labourer.id}`}>Advance Amount</Label>
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
                   </div>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
         <Card>
            <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">
                  No labourers to mark attendance for. Please add a labourer first.
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
