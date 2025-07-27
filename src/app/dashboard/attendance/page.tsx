"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { useData } from "@/hooks/useData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AttendancePage() {
  const { labourers, attendance, markAttendance } = useData();
  const { toast } = useToast();
  const todayStr = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

  const todayAttendance = useMemo(() => {
    return attendance.find((a) => a.date === todayStr)?.presentLabourerIds || [];
  }, [attendance, todayStr]);

  const [presentIds, setPresentIds] = useState<Set<string>>(new Set(todayAttendance));

  const handleTogglePresent = (labourerId: string) => {
    setPresentIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(labourerId)) {
        newSet.delete(labourerId);
      } else {
        newSet.add(labourerId);
      }
      return newSet;
    });
  };

  const handleSaveAttendance = () => {
    markAttendance(todayStr, Array.from(presentIds));
    toast({
      title: "Attendance Saved",
      description: `Attendance for ${format(new Date(), "MMMM dd, yyyy")} has been updated.`,
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold tracking-tight">
        Mark Attendance
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Today's Attendance</CardTitle>
          <CardDescription>
            {format(new Date(), "EEEE, MMMM dd, yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {labourers.length > 0 ? (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Present</TableHead>
                    <TableHead>Labourer</TableHead>
                    <TableHead>Mobile</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labourers.map((labourer) => (
                    <TableRow key={labourer.id}>
                      <TableCell>
                        <Checkbox
                          id={`att-${labourer.id}`}
                          checked={presentIds.has(labourer.id)}
                          onCheckedChange={() => handleTogglePresent(labourer.id)}
                          aria-label={`Mark ${labourer.fullName} as present`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={labourer.profilePhotoUrl} data-ai-hint="profile person" />
                            <AvatarFallback>{labourer.fullName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <Label htmlFor={`att-${labourer.id}`} className="font-medium cursor-pointer">
                            {labourer.fullName}
                          </Label>
                        </div>
                      </TableCell>
                       <TableCell>{labourer.mobile}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveAttendance}>Save Attendance</Button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center">
              No labourers to mark attendance for. Please add a labourer first.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
