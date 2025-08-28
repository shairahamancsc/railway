
"use client";

import { useData } from "@/hooks/useData";
import { useParams, useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ArrowLeft, TrendingDown, TrendingUp, Wallet, Banknote } from "lucide-react";

export default function SettlementDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { settlements, loading, error } = useData();

  const settlement = settlements.find((s) => s.id === id);

  if (loading) {
     return (
        <div className="space-y-8">
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-80" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
        </div>
    )
  }

  if (error || !settlement) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>
            {error ? "Failed to load settlement." : "Settlement not found."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2" />
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { report_data, overall_totals } = settlement;
  const totalLoanRepayments = overall_totals.totalLoanRepayments || 0;
  
  return (
    <div className="space-y-8">
       <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft />
          </Button>
          <div>
            <h1 className="text-3xl font-headline font-bold tracking-tight">
              Settlement Details
            </h1>
            <p className="text-muted-foreground">
              Report for {format(new Date(settlement.start_date), "dd MMM, yyyy")} to {format(new Date(settlement.end_date), "dd MMM, yyyy")}
            </p>
          </div>
      </div>

       <Card>
            <CardHeader>
                <CardTitle>Overall Payroll Summary</CardTitle>
                <CardDescription>
                    This is the total payroll summary that was settled for this period.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Gross Wages</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{overall_totals.totalGrossWages.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Total wages earned before deductions.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Daily Advance</CardTitle>
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">₹{overall_totals.totalAdvancePaid.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Advances given on daily basis.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Loan Repayments</CardTitle>
                        <Banknote className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₹{totalLoanRepayments.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Amount paid back by workers.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Final Paid</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">₹{(overall_totals.totalFinalPaid || 0).toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Final amount paid to all workers.</p>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>

      <Card>
        <CardHeader>
          <CardTitle>Individual Worker Payouts</CardTitle>
          <CardDescription>
            A detailed breakdown of wages and advances for each worker during this period.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker Name</TableHead>
                  <TableHead className="text-right">Present</TableHead>
                  <TableHead className="text-right">Half</TableHead>
                  <TableHead className="text-right">Total Salary</TableHead>
                  <TableHead className="text-right">Daily Advance</TableHead>
                  <TableHead className="text-right">Net Payable</TableHead>
                  <TableHead className="text-right">Current Loan</TableHead>
                  <TableHead className="text-right">Loan Repayment</TableHead>
                  <TableHead className="text-right">New Loan</TableHead>
                  <TableHead className="text-right">Updated Loan Bal.</TableHead>
                  <TableHead className="text-right font-bold text-primary">
                    Final Paid
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report_data.map((data) => (
                    <TableRow key={data.labourerId}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {data.fullName}
                      </TableCell>
                      <TableCell className="text-right">
                        {data.presentDays}
                      </TableCell>
                      <TableCell className="text-right">
                        {data.halfDays}
                      </TableCell>
                      <TableCell className="text-right">
                        {data.totalSalary.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {data.totalAdvance.toFixed(2)}
                      </TableCell>
                      <TableCell
                        className={`text-right font-bold ${
                          data.netPayable >= 0 ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {data.netPayable.toFixed(2)}
                      </TableCell>
                       <TableCell className={`text-right ${data.currentLoan > 0 ? 'text-red-600' : ''}`}>
                          {(data.currentLoan || 0).toFixed(2)}
                        </TableCell>
                      <TableCell className="text-right text-green-600">
                        {(data.loanRepayment || 0).toFixed(2)}
                      </TableCell>
                       <TableCell className="text-right text-red-600">
                        {(data.newLoan || 0).toFixed(2)}
                      </TableCell>
                       <TableCell className={`text-right font-bold ${data.updatedLoanBalance > 0 ? 'text-red-600' : ''}`}>
                          {(data.updatedLoanBalance || 0).toFixed(2)}
                         </TableCell>
                      <TableCell
                        className={`text-right font-bold text-primary`}
                      >
                        {(data.finalAmountPaid || 0).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
