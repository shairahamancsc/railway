
"use client";

import { useState, useMemo } from "react";
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isAfter } from "date-fns";
import { useData } from "@/hooks/useData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar as CalendarIcon, Printer, Pencil, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AttendanceForm } from "@/components/dashboard/attendance-form";
import type { DailyLabourerRecord } from "@/types";

interface ReportData {
  labourerId: string;
  fullName: string;
  presentDays: number;
  halfDays: number;
  totalAdvance: number;
  totalSalary: number;
  attendance: { [key: string]: DailyLabourerRecord | { status: 'absent' } };
}

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

  const reportData = useMemo(() => {
    const data: ReportData[] = labourers.map(labourer => {
      let presentDays = 0;
      let halfDays = 0;
      let totalAdvance = 0;
      const dailySalary = labourer.daily_salary || 0;
      const attendanceByDate: { [key: string]: DailyLabourerRecord | { status: 'absent' } } = {};

      daysInInterval.forEach(day => {
        if (isAfter(day, today)) return;

        const dayStr = format(day, "yyyy-MM-dd");
        const attendanceRecordForDay = attendance.find(a => a.date === dayStr);
        const labourerRecord = attendanceRecordForDay?.records?.find(r => r.labourerId === labourer.id);

        if (labourerRecord) {
          attendanceByDate[dayStr] = labourerRecord;
          if (labourerRecord.status === 'present') {
            presentDays++;
          }
          if (labourerRecord.status === 'half-day') {
            halfDays++;
          }
          totalAdvance += labourerRecord.advance || 0;
        } else {
          attendanceByDate[dayStr] = { status: 'absent' };
        }
      });
      
      const totalSalary = (presentDays * dailySalary) + (halfDays * dailySalary / 2);

      return {
        labourerId: labourer.id,
        fullName: labourer.fullName,
        presentDays,
        halfDays,
        totalAdvance,
        totalSalary,
        attendance: attendanceByDate
      };
    });
    return data;
  }, [labourers, attendance, daysInInterval, today]);

  const overallTotals = useMemo(() => {
    return reportData.reduce((acc, curr) => {
      acc.totalGrossWages += curr.totalSalary;
      acc.totalAdvancePaid += curr.totalAdvance;
      return acc;
    }, { totalGrossWages: 0, totalAdvancePaid: 0 });
  }, [reportData]);


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
          <CardTitle>Worker Attendance & Salary Report</CardTitle>
          <CardDescription>P = Present, A = Absent, H = Half Day. All amounts are in ₹.</CardDescription>
        </CardHeader>
        <CardContent>
          {labourers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 bg-card z-10">Worker Name</TableHead>
                    {daysInInterval.map((day) => (
                      <TableHead key={day.toString()} className="text-center min-w-[120px]">
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
                    <TableHead className="text-right font-bold">Present</TableHead>
                    <TableHead className="text-right font-bold">Half</TableHead>
                    <TableHead className="text-right font-bold">Total Salary</TableHead>
                    <TableHead className="text-right font-bold">Total Advance</TableHead>
                    <TableHead className="text-right font-bold text-primary">Net Payable</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.map((data) => {
                    const netPayable = data.totalSalary - data.totalAdvance;
                    return (
                      <TableRow key={data.labourerId}>
                        <TableCell className="font-medium whitespace-nowrap sticky left-0 bg-card z-10">{data.fullName}</TableCell>
                        {daysInInterval.map((day) => {
                          const dayStr = format(day, "yyyy-MM-dd");
                          const record = data.attendance[dayStr];
                          
                          if (isAfter(day, today) || !record) {
                              return <TableCell key={dayStr} className="text-center text-muted-foreground">-</TableCell>;
                          }

                          let statusChar = 'A';
                          let colorClass = 'text-red-600';

                          switch(record.status) {
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

                          return (
                            <TableCell key={dayStr} className="text-center">
                              <span className={`font-bold ${colorClass}`}>
                                  {statusChar}
                              </span>
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-right font-medium">{data.presentDays}</TableCell>
                        <TableCell className="text-right font-medium">{data.halfDays}</TableCell>
                        <TableCell className="text-right">{data.totalSalary.toFixed(2)}</TableCell>
                        <TableCell className="text-right text-red-600">{data.totalAdvance.toFixed(2)}</TableCell>
                        <TableCell className={`text-right font-bold ${netPayable >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {netPayable.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
      
      {labourers.length > 0 && (
         <Card className="no-print">
            <CardHeader>
                <CardTitle>Overall Payroll Summary</CardTitle>
                <CardDescription>
                    This is the total payroll summary for all workers for the period from {dateRange?.from ? format(dateRange.from, "dd-MMM-yy") : ''} to {dateRange?.to ? format(dateRange.to, "dd-MMM-yy") : ''}.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Gross Wages</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{overallTotals.totalGrossWages.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Total wages earned before deductions.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Advance Paid</CardTitle>
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">₹{overallTotals.totalAdvancePaid.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Total advance amount given to workers.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Net Payable</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">₹{(overallTotals.totalGrossWages - overallTotals.totalAdvancePaid).toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Final amount to be paid to all workers.</p>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
      )}
      
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
