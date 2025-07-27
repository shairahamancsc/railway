
"use client";

import { useState } from "react";
import { format, eachDayOfInterval, startOfWeek, endOfWeek, isAfter } from "date-fns";
import { useData } from "@/hooks/useData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Printer } from "lucide-react";

export default function ReportsPage() {
  const { labourers, attendance } = useData();
  const [dateRange] = useState({
    from: startOfWeek(new Date()),
    to: endOfWeek(new Date()),
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

  const handlePrint = () => {
    window.print();
  };

  const daysInInterval = eachDayOfInterval({
    start: dateRange.from,
    end: dateRange.to,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-headline font-bold tracking-tight">
          Attendance Reports
        </h1>
        <div className="flex flex-col sm:flex-row items-center gap-2 no-print">
          <Button onClick={handlePrint} className="gap-2 w-full sm:w-auto">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <Card className="printable">
        <CardHeader>
          <CardTitle>Report for This Week</CardTitle>
          <CardDescription>P = Present, A = Absent, H = Half Day</CardDescription>
        </CardHeader>
        <CardContent>
          {labourers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Labourer Name</TableHead>
                    {daysInInterval.map((day) => (
                      <TableHead key={day.toString()} className="text-center">
                        {format(day, "MMM d")}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labourers.map((labourer) => (
                    <TableRow key={labourer.id}>
                      <TableCell className="font-medium whitespace-nowrap">{labourer.fullName}</TableCell>
                      {daysInInterval.map((day) => {
                        const dayStr = format(day, "yyyy-MM-dd");
                        const attendanceRecordForDay = attendance.find((a) => a.date === dayStr);
                        const labourerRecord = attendanceRecordForDay?.records.find(r => r.labourerId === labourer.id);
                        
                        if (isAfter(day, today)) {
                            return (
                                <TableCell key={dayStr} className="text-center text-muted-foreground">-</TableCell>
                            );
                        }

                        let statusChar = 'A';
                        let colorClass = 'text-red-600';

                        if (labourerRecord) {
                            switch(labourerRecord.status) {
                                case 'present':
                                    statusChar = 'P';
                                    colorClass = 'text-green-600';
                                    break;
                                case 'half-day':
                                    statusChar = 'H';
                                    colorClass = 'text-yellow-600';
                                    break;
                                case 'absent':
                                default:
                                    statusChar = 'A';
                                    colorClass = 'text-red-600';
                                    break;
                            }
                        }

                        return (
                          <TableCell key={dayStr} className="text-center">
                            <span className={`font-bold ${colorClass}`}>
                                {statusChar}
                            </span>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No labourer data available for this report.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
