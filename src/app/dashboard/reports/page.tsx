
"use client";

import { useState, useMemo, useEffect } from "react";
import type { Metadata } from 'next';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isAfter } from "date-fns";
import * as XLSX from "xlsx";
import { useData } from "@/hooks/useData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar as CalendarIcon, Printer, Pencil, TrendingUp, TrendingDown, Wallet, Archive, Banknote, FileDown, FileUp } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AttendanceForm } from "@/components/dashboard/attendance-form";
import type { DailyLabourerRecord, ReportData, OverallTotals } from "@/types";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

export const metadata: Metadata = {
  title: 'Attendance Reports',
  description: 'Generate, view, and export detailed payroll and attendance reports for any date range. Settle reports to create a permanent historical record.',
};


const exportToExcel = (reportData: ReportData[], overallTotals: OverallTotals, dateRange: DateRange | undefined) => {
    if (!dateRange?.from || !dateRange?.to) return;
    
    const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const headers = ["Worker Name"];
    days.forEach(day => headers.push(format(day, "dd-MMM-yy")));
    headers.push("Present", "Half", "Total Salary", "Daily Advance", "Net Payable", "Current Loan", "Loan Repayment", "New Loan", "Updated Loan Bal.", "Final Amount Paid");

    const dataForSheet = reportData.map(d => {
        const row: { [key: string]: any } = { "Worker Name": d.fullName };
        
        days.forEach(day => {
            const dayStr = format(day, "yyyy-MM-dd");
            const dateHeader = format(day, "dd-MMM-yy");
            
            if (isAfter(day, today)) {
                row[dateHeader] = '-';
                return;
            }

            const record = d.attendance[dayStr] as DailyLabourerRecord | { status: 'absent' };
            let statusValue: number | string = 0;
            if (record) {
                switch(record.status) {
                    case 'present': statusValue = 1; break;
                    case 'half-day': statusValue = 0.5; break;
                    default: statusValue = 0;
                }
            }
            row[dateHeader] = statusValue;
        });

        row["Present"] = d.presentDays;
        row["Half"] = d.halfDays;
        row["Total Salary"] = d.totalSalary;
        row["Daily Advance"] = d.totalAdvance;
        row["Net Payable"] = d.netPayable;
        row["Current Loan"] = d.currentLoan;
        row["Loan Repayment"] = d.loanRepayment;
        row["New Loan"] = d.newLoan;
        row["Updated Loan Bal."] = d.updatedLoanBalance;
        row["Final Amount Paid"] = d.finalAmountPaid;
        
        return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForSheet, { header: headers });

    // Add overall totals at the bottom
    XLSX.utils.sheet_add_aoa(worksheet, [[]], { origin: -1 }); // Spacer row
    XLSX.utils.sheet_add_aoa(worksheet, [["Overall Summary"]], { origin: -1 });
    XLSX.utils.sheet_add_aoa(worksheet, [
        ["Total Gross Wages", overallTotals.totalGrossWages],
        ["Total Daily Advance", overallTotals.totalAdvancePaid],
        ["Total Loan Repayments", overallTotals.totalLoanRepayments],
        ["Total New Loans Given", overallTotals.totalNewLoans],
        ["Total Final Paid Amount", overallTotals.totalFinalPaid],
    ], { origin: -1 });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payroll Report");

    // Auto-fit columns
    const cols = headers.map(header => ({
        wch: Math.max(15, ...dataForSheet.map(d => (d[header] || '').toString().length), header.length)
    }));
    worksheet["!cols"] = cols;

    const fromDate = dateRange?.from ? format(dateRange.from, "dd-MMM-yy") : '';
    const toDate = dateRange?.to ? format(dateRange.to, "dd-MMM-yy") : '';
    XLSX.writeFile(workbook, `Payroll Report ${fromDate} to ${toDate}.xlsx`);
}

export default function ReportsPage() {
  const { labourers, attendance, addSettlement } = useData();
  const { toast } = useToast();
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const [editDate, setEditDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  const [newLoans, setNewLoans] = useState<{[key: string]: number}>({});
  const [loanRepayments, setLoanRepayments] = useState<{[key: string]: number}>({});


  const handlePrint = () => {
    window.print();
  };
  
  const handleEditClick = (day: Date) => {
    setEditDate(day);
    setIsDialogOpen(true);
  }
  
  useEffect(() => {
    // Reset inputs when labourers data changes
    setNewLoans({});
    setLoanRepayments({});
  }, [labourers]);

  const daysInInterval = dateRange?.from && dateRange?.to ? eachDayOfInterval({
    start: dateRange.from,
    end: dateRange.to,
  }) : [];

  const reportData: ReportData[] = useMemo(() => {
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
      const loanRepaymentAmount = loanRepayments[labourer.id] || 0;
      const newLoanAmount = newLoans[labourer.id] || 0;
      const netPayable = totalSalary - totalAdvance;
      const finalAmountPaid = netPayable - loanRepaymentAmount + newLoanAmount;
      const currentLoan = labourer.loan_balance || 0;
      const updatedLoanBalance = currentLoan - loanRepaymentAmount + newLoanAmount;


      return {
        labourerId: labourer.id,
        fullName: labourer.fullName,
        presentDays,
        halfDays,
        totalAdvance: totalAdvance,
        totalSalary,
        currentLoan,
        loanRepayment: loanRepaymentAmount,
        netPayable,
        newLoan: newLoanAmount,
        finalAmountPaid,
        updatedLoanBalance,
        attendance: attendanceByDate
      };
    });
    return data;
  }, [labourers, attendance, daysInInterval, today, newLoans, loanRepayments]);

  const overallTotals: OverallTotals = useMemo(() => {
    return reportData.reduce((acc, curr) => {
      acc.totalGrossWages += curr.totalSalary;
      acc.totalAdvancePaid += curr.totalAdvance;
      acc.totalCurrentLoans += curr.currentLoan;
      acc.totalLoanRepayments += curr.loanRepayment;
      acc.totalNewLoans += curr.newLoan;
      acc.totalFinalPaid += curr.finalAmountPaid;
      return acc;
    }, { totalGrossWages: 0, totalAdvancePaid: 0, totalCurrentLoans: 0, totalLoanRepayments: 0, totalNewLoans: 0, totalFinalPaid: 0 });
  }, [reportData]);
  

  const handleSettleReport = async () => {
    if (!dateRange?.from || !dateRange?.to) {
        toast({ title: "Error", description: "Please select a valid date range.", variant: "destructive" });
        return;
    }
    setIsSettling(true);
    try {
        await addSettlement({
            start_date: format(dateRange.from, "yyyy-MM-dd"),
            end_date: format(dateRange.to, "yyyy-MM-dd"),
            report_data: reportData,
            overall_totals: overallTotals
        });
        toast({
            title: "Report Settled!",
            description: "The payroll report has been saved successfully.",
            action: (
                <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/settlements')}>
                    View Settlements
                </Button>
            ),
        });
        // Clear inputs after successful settlement
        setNewLoans({});
        setLoanRepayments({});
    } catch (error: any) {
        toast({ title: "Error", description: error.message || "Failed to settle report.", variant: "destructive" });
    } finally {
        setIsSettling(false);
    }
  }


  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-headline font-bold tracking-tight hidden md:block">
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
          <div className="flex w-full sm:w-auto items-center gap-2">
            <Button onClick={handlePrint} className="gap-2 w-full">
                <Printer className="h-4 w-4" />
                Print
            </Button>
            <Button onClick={() => exportToExcel(reportData, overallTotals, dateRange)} variant="secondary" className="gap-2 w-full">
                <FileDown className="h-4 w-4" />
                Export
            </Button>
            <Button disabled className="gap-2 w-full">
                <FileUp className="h-4 w-4" />
                Import
            </Button>
          </div>
        </div>
      </div>

      <Card className="printable">
        <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <CardTitle>Worker Attendance & Salary Report</CardTitle>
                    <CardDescription>P = Present, A = Absent, H = Half Day. All amounts are in ₹.</CardDescription>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="secondary" className="gap-2 no-print" disabled={isSettling}>
                            <Archive className="h-4 w-4" />
                            {isSettling ? "Saving..." : "Settle & Save Report"}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Settle this Report?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will create a permanent, historical snapshot of the current report from <span className="font-bold">{dateRange?.from ? format(dateRange.from, 'dd-MMM-yy') : ''}</span> to <span className="font-bold">{dateRange?.to ? format(dateRange.to, 'dd-MMM-yy') : ''}</span>. This action cannot be undone. Loan balances will be updated.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSettleReport}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {labourers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-card z-10 whitespace-nowrap min-w-[150px]">Worker Name</TableHead>
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
                      <TableHead className="text-right font-bold min-w-[80px]">Present</TableHead>
                      <TableHead className="text-right font-bold min-w-[80px]">Half</TableHead>
                      <TableHead className="text-right font-bold min-w-[120px]">Total Salary</TableHead>
                      <TableHead className="text-right font-bold min-w-[120px]">Daily Advance</TableHead>
                      <TableHead className="text-right font-bold min-w-[120px]">Net Payable</TableHead>
                      <TableHead className="text-right font-bold min-w-[140px]">Current Loan</TableHead>
                      <TableHead className="text-right font-bold min-w-[180px] no-print">Loan Repayment</TableHead>
                      <TableHead className="text-right font-bold min-w-[180px] no-print">New Loan</TableHead>
                      <TableHead className="text-right font-bold min-w-[140px]">Updated Loan Bal.</TableHead>
                      <TableHead className="text-right font-bold text-primary min-w-[140px]">Final Amount Paid</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.map((data) => (
                        <TableRow key={data.labourerId}>
                          <TableCell className="font-medium whitespace-nowrap sticky left-0 bg-card z-10">{data.fullName}</TableCell>
                          {daysInInterval.map((day) => {
                            const dayStr = format(day, "yyyy-MM-dd");
                            const record = data.attendance[dayStr] as DailyLabourerRecord | { status: 'absent' };
                            
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
                            
                            const hasAdvance = 'advance' in record && record.advance && record.advance > 0;

                            return (
                              <TableCell key={dayStr} className="text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <span className={`font-bold ${colorClass}`}>
                                      {statusChar}
                                  </span>
                                  {hasAdvance && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Advance: ₹{record.advance}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-right font-medium">{data.presentDays}</TableCell>
                          <TableCell className="text-right font-medium">{data.halfDays}</TableCell>
                          <TableCell className="text-right">{data.totalSalary.toFixed(2)}</TableCell>
                          <TableCell className="text-right text-red-600">{data.totalAdvance.toFixed(2)}</TableCell>
                          <TableCell className={`text-right font-bold ${data.netPayable >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                            {data.netPayable.toFixed(2)}
                          </TableCell>
                          <TableCell className={`text-right ${data.currentLoan > 0 ? 'text-red-600' : ''}`}>
                            {data.currentLoan.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right no-print">
                            <Input 
                              type="number"
                              placeholder="0"
                              className="text-right h-8"
                              value={loanRepayments[data.labourerId] || ''}
                              onChange={(e) => setLoanRepayments(prev => ({...prev, [data.labourerId]: e.target.valueAsNumber || 0}))}
                            />
                          </TableCell>
                          <TableCell className="text-right no-print">
                            <Input 
                              type="number"
                              placeholder="0"
                              className="text-right h-8"
                              value={newLoans[data.labourerId] || ''}
                              onChange={(e) => setNewLoans(prev => ({...prev, [data.labourerId]: e.target.valueAsNumber || 0}))}
                            />
                          </TableCell>
                          <TableCell className={`text-right font-bold ${data.updatedLoanBalance > 0 ? 'text-red-600' : ''}`}>
                            {data.updatedLoanBalance.toFixed(2)}
                          </TableCell>
                          <TableCell className={`text-right font-bold text-primary`}>
                            {data.finalAmountPaid.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No worker data available for this report.
              </p>
            )}
          </div>
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
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                        <CardTitle className="text-sm font-medium">Total Daily Advance</CardTitle>
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">₹{overallTotals.totalAdvancePaid.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Advances given on daily basis.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Loan Repayments</CardTitle>
                        <Banknote className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₹{overallTotals.totalLoanRepayments.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Amount paid back by workers.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Final Paid Amount</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">₹{overallTotals.totalFinalPaid.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Final amount paid to all workers.</p>                    </CardContent>
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
