
"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/hooks/useData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck } from "lucide-react";
import { format } from "date-fns";
import { DesignationChart } from "@/components/dashboard/designation-chart";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const router = useRouter();
  const { labourers, attendance, loading } = useData();

  useEffect(() => {
    const authToken = localStorage.getItem("auth-token");

    if (authToken !== "authenticated") {
      router.push("/login");
    }
  }, [router]);

  const today = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const todayAttendance = useMemo(() => attendance.find(a => a.date === today), [attendance, today]);
  const presentToday = useMemo(() => todayAttendance ? todayAttendance.presentLabourerIds.length : 0, [todayAttendance]);

  const designationData = useMemo(() => {
    const counts: { [key: string]: number } = {};
    for (const labourer of labourers) {
      counts[labourer.designation] = (counts[labourer.designation] || 0) + 1;
    }
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [labourers]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="hidden md:block">
            <h1 className="text-3xl font-headline font-bold tracking-tight">
              Dashboard
            </h1>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="grid gap-6 sm:grid-cols-2">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Card className="sm:col-span-2">
                  <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                      <Skeleton className="h-[250px] w-full" />
                  </CardContent>
                </Card>
            </div>
            <Skeleton className="h-[400px]" />
        </div>
         <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="hidden md:block">
        <h1 className="text-3xl font-headline font-bold tracking-tight">
          Dashboard
        </h1>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
          <div className="grid gap-6 sm:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Workers
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{labourers.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Total workforce registered
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Present Today</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{presentToday}</div>
                  <p className="text-xs text-muted-foreground">
                    Out of {labourers.length} workers
                  </p>
                </CardContent>
              </Card>
              <Card className="sm:col-span-2">
                <CardHeader>
                  <CardTitle>Worker Designation Breakdown</CardTitle>
                  <CardDescription>Distribution of workers across different roles.</CardDescription>
                </CardHeader>
                <CardContent>
                  <DesignationChart data={designationData} />
                </CardContent>
              </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Today's Attendance Status</CardTitle>
              <CardDescription>A quick look at who is present and absent today.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Worker</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {labourers.length > 0 ? (
                      labourers.slice(0, 5).map((labourer) => ( // Show first 5 for a preview
                        <TableRow key={labourer.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={labourer.profile_photo_url} alt={`${labourer.fullName} profile photo`} data-ai-hint="profile person" width={32} height={32}/>
                                  <AvatarFallback>
                                    {labourer.fullName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium whitespace-nowrap">{labourer.fullName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {todayAttendance?.presentLabourerIds.includes(labourer.id) ? (
                              <Badge>Present</Badge>
                            ) : (
                              <Badge variant="secondary">Absent</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center">
                          No workers added yet.
                        </TableCell>
                      </TableRow>
                    )}
                     {labourers.length > 5 && (
                        <TableRow>
                            <TableCell colSpan={2} className="text-center text-sm text-muted-foreground">
                                ...and {labourers.length - 5} more.
                            </TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
            </CardContent>
          </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>All Worker Details</CardTitle>
          <CardDescription>A comprehensive list of all registered workers in the system.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Profile</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead className="hidden md:table-cell">Father's Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Mobile No.</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Group</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {labourers.length > 0 ? (
                    labourers.map((labourer) => (
                        <TableRow key={labourer.id}>
                        <TableCell>
                            <Avatar className="h-10 w-10">
                            <AvatarImage src={labourer.profile_photo_url} alt={`${labourer.fullName} profile photo`} data-ai-hint="profile person" width={40} height={40}/>
                            <AvatarFallback>
                                {labourer.fullName.charAt(0)}
                            </AvatarFallback>
                            </Avatar>
                        </TableCell>
                        <TableCell className="font-medium whitespace-nowrap">
                            {labourer.fullName}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{labourer.documents.fatherName}</TableCell>
                        <TableCell className="hidden sm:table-cell">{labourer.documents.mobile}</TableCell>
                        <TableCell>
                            <Badge variant="outline">{labourer.designation}</Badge>
                        </TableCell>
                        <TableCell>
                            {labourer.group ? <Badge variant="secondary">{labourer.group}</Badge> : 'N/A'}
                        </TableCell>
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center">
                        No workers added yet.
                        </TableCell>c
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
