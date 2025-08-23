"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/hooks/useData";
import {
  Card,
  CardContent,
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

export default function DashboardPage() {
  const router = useRouter();
  const { labourers, attendance } = useData();

  useEffect(() => {
    const authToken = localStorage.getItem("auth-token");

    if (authToken !== "authenticated") {
      router.push("/login");
    }
  }, [router]);


  const today = format(new Date(), "yyyy-MM-dd");
  const todayAttendance = attendance.find(a => a.date === today);
  const presentToday = todayAttendance ? todayAttendance.presentLabourerIds.length : 0;
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold tracking-tight">
        Dashboard
      </h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Worker Details</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profile</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead className="hidden md:table-cell">Father's Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Mobile No.</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labourers.length > 0 ? (
                  labourers.map((labourer) => (
                    <TableRow key={labourer.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={labourer.profile_photo_url} alt={labourer.fullName} data-ai-hint="profile person" />
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
                    <TableCell colSpan={5} className="text-center">
                      No workers added yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
