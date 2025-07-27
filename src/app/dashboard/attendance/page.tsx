
"use client";

import { useMemo, Suspense } from "react";
import { parse, isValid } from "date-fns";
import { useSearchParams } from "next/navigation";
import { AttendanceForm } from "@/components/dashboard/attendance-form";
import { Skeleton } from "@/components/ui/skeleton";

function AttendanceContent() {
  const searchParams = useSearchParams();
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

  return <AttendanceForm targetDate={targetDate} />;
}

export default function AttendancePage() {
    return (
        <Suspense fallback={
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                      <Skeleton className="h-9 w-64 mb-2" />
                      <Skeleton className="h-5 w-48" />
                  </div>
                  <Skeleton className="h-10 w-36" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        }>
            <AttendanceContent />
        </Suspense>
    )
}

