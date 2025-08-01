
"use client";

import { useState } from "react";
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isAfter } from "date-fns";
import { useData } from "@/hooks/useData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar as CalendarIcon, Printer, Pencil } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AttendanceForm } from "@/components/dashboard/attendance-form";

export default function ReportsPage() {
  const { labourers, attendance } = useData();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const [editDate, setEditDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };
  
  const handleEditClick = (day: Date) => {
    setEditDate(day);
    setIsDialogOpen(true);
  }

  const daysInInterval = dateRange?.from && dateRange?.to ? eachDayOfInterval({
    start: dateRange.from,
    end: dateRange.to,
  }) : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-headline font-bold tracking-tight">
          Attendance Reports
        </h1>
        <div className="flex flex-col sm:flex-row items-center gap-2 no-print">
            <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full sm:w-[300px] justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd-MMM-yyyy")} -{" "}
                          {format(dateRange.to, "dd-MMM-yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "dd-MMM-yyyy")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    disabled={(date) => isAfter(date, new Date())}
                  />
                </PopoverContent>
              </Popover>
          <Button onClick={handlePrint} className="gap-2 w-full sm:w-auto">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <Card className="printable">
        <CardHeader>
          <CardTitle>Monthly Attendance Report</CardTitle>
          <CardDescription>P = Present, A = Absent, H = Half Day</CardDescription>
        </CardHeader>
        <CardContent>
          {labourers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker Name</TableHead>
                    {daysInInterval.map((day) => (
                      <TableHead key={day.toString()} className="text-center">
                         <div className="flex items-center justify-center gap-2">
                          {format(day, "dd-MMM")}
                          {!isAfter(day, today) && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 no-print" onClick={() => handleEditClick(day)}>
                                      <Pencil className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit Attendance</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
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
                        const labourerRecord = attendanceRecordForDay?.records?.find(r => r.labourerId === labourer.id);
                        
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
              No worker data available for this report.
            </p>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[80vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Edit Attendance for {editDate ? format(editDate, "dd MMMM, yyyy") : ''}</DialogTitle>
            </DialogHeader>
            {editDate && <AttendanceForm targetDate={editDate} onSave={() => setIsDialogOpen(false)} />}
          </DialogContent>
      </Dialog>

    </div>
  );
}

    