
"use client";

import { useData } from "@/hooks/useData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Archive, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettlementsPage() {
  const { settlements, loading, error } = useData();

  if (loading) {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-9 w-64 mb-2" />
                    <Skeleton className="h-5 w-80" />
                </div>
            </div>
            <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
        </div>
    )
  }

  if (error) {
     return (
        <Card>
            <CardHeader>
                <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-destructive">Failed to load settlements. Please try again later.</p>
            </CardContent>
        </Card>
     )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">
            Settled Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            View historical snapshots of your payroll reports.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
          <CardDescription>
            A list of all settled payroll periods.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {settlements.length > 0 ? (
            <div className="space-y-4">
              {settlements.map((settlement) => (
                <Link
                  key={settlement.id}
                  href={`/dashboard/settlements/${settlement.id}`}
                  passHref
                >
                  <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                        <Archive className="h-6 w-6 text-primary flex-shrink-0" />
                        <div>
                            <p className="font-bold">
                                {format(new Date(settlement.start_date), "dd MMM, yyyy")} - {format(new Date(settlement.end_date), "dd MMM, yyyy")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Settled on {format(new Date(settlement.created_at), "dd MMM, yyyy, p")}
                            </p>
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Archive className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-xl font-semibold">No Settlements Found</h3>
              <p className="mt-1 text-muted-foreground">
                You haven't settled any reports yet. Go to the Reports page to save one.
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/reports">Go to Reports</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
