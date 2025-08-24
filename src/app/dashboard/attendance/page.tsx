
"use client";

import { useMemo, Suspense } from "react";
import { parse, isValid, format } from "date-fns";
import { useSearchParams, useRouter } from "next/navigation";
import { AttendanceForm } from "@/components/dashboard/attendance-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

function AttendanceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetDateStr = searchParams.get("date");

  const targetDate = useMemo(() => {
    if (targetDateStr) {
      const parsedDate = parse(targetDateStr, "yyyy-MM-dd", new Date());
      if (isValid(parsedDate)) {
        return parsedDate;
      }
    }
    return new Date();
  }, [targetDateStr]);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const newPath = `/dashboard/attendance?date=${format(date, "yyyy-MM-dd")}`;
      router.push(newPath);
    }
  };

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
        <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !targetDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {targetDate ? format(targetDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={targetDate}
                  onSelect={handleDateChange}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
        </div>
      </div>
      <AttendanceForm targetDate={targetDate} />
    </div>
  );
}

export default function AttendancePage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Skeleton className="h-9 w-64 mb-2" />
              <Skeleton className="h-5 w-48" />
            </div>
            <Skeleton className="h-10 w-36" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
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
      }
    >
      <AttendanceContent />
    </Suspense>
  );
}
