"use client";

import { useState } from "react";
import { format, eachDayOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isAfter } from "date-fns";
import { useData } from "@/hooks/useData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Printer } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export default function ReportsPage() {
  const { labourers, attendance } = useData();
  const [dateRange, setDateRange] = useState({
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
          <Select
            onValueChange={(value) => {
              const now = new Date();
              if (value === "this_week") setDateRange({ from: startOfWeek(now), to: endOfWeek(now) });
              if (value === "this_month") setDateRange({ from: startOfMonth(now), to: endOfMonth(now) });
            }}
            defaultValue="this_week"
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select a range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this_week">This Week</SelectItem>
              <SelectItem value="this_month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full sm:w-[280px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(dateRange.from, "PPP")} - {format(dateRange.to, "PPP")}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="range"
                    selected={{from: dateRange.from, to: dateRange.to}}
                    onSelect={(range) => range && setDateRange({from: range.from || new Date(), to: range.to || new Date()})}
                    initialFocus
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
          <CardTitle>Report for {format(dateRange.from, "PPP")} to {format(dateRange.to, "PPP")}</CardTitle>
          <CardDescription>P = Present, A = Absent</CardDescription>
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
                        {format(day, "d MMM")}
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
                        const attendanceRecord = attendance.find((a) => a.date === dayStr);
                        const isPresent = attendanceRecord?.presentLabourerIds.includes(labourer.id);
                        
                        // Don't show attendance for future dates
                        if (isAfter(day, today)) {
                            return (
                                <TableCell key={dayStr} className="text-center text-muted-foreground">-</TableCell>
                            );
                        }

                        return (
                          <TableCell key={dayStr} className="text-center">
                            <span className={`font-bold ${isPresent ? 'text-green-600' : 'text-red-600'}`}>
                                {isPresent ? "P" : "A"}
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
