
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useData } from "@/hooks/useData";
import { Button } from "@/components/ui/button";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { HandCoins, Landmark } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const loanSchema = z.object({
  labourerId: z.string({ required_error: "Please select a worker." }),
  amount: z.coerce.number().min(1, "Amount must be greater than 0."),
  type: z.enum(["loan", "repayment"], { required_error: "Please select a transaction type." }),
  notes: z.string().optional(),
});

export default function LoansPage() {
  const { labourers, adjustLoanBalance, loading } = useData();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof loanSchema>>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      amount: 0,
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loanSchema>) => {
    setIsSubmitting(true);
    try {
      const amount = values.type === "loan" ? values.amount : -values.amount;
      await adjustLoanBalance(values.labourerId, amount, values.notes);
      
      const selectedLabourer = labourers.find(l => l.id === values.labourerId);
      
      toast({
        title: "Success",
        description: `Transaction of ₹${values.amount} for ${selectedLabourer?.fullName} has been recorded.`,
      });
      form.reset({ amount: 0, notes: "" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to record transaction.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4">
        <Landmark className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
        <div className="hidden md:block">
            <h1 className="text-3xl font-headline font-bold tracking-tight">
            Loan Management
            </h1>
            <p className="text-muted-foreground mt-1">Record loans and repayments, and view worker balances.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Worker Loan Balances</CardTitle>
              <CardDescription>
                View the current outstanding loan balance for each worker.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Worker</TableHead>
                        <TableHead className="text-right">Loan Balance (₹)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                        <TableRow>
                            <TableCell colSpan={2} className="text-center">Loading...</TableCell>
                        </TableRow>
                        ) : labourers.length > 0 ? (
                        labourers.sort((a,b) => (b.loan_balance || 0) - (a.loan_balance || 0)).map((labourer) => (
                            <TableRow key={labourer.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={labourer.profile_photo_url} alt={labourer.fullName} width={40} height={40}/>
                                    <AvatarFallback>{labourer.fullName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium whitespace-nowrap">{labourer.fullName}</span>
                                </div>
                            </TableCell>
                            <TableCell className={`text-right font-bold ${labourer.loan_balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {(labourer.loan_balance || 0).toFixed(2)}
                            </TableCell>
                            </TableRow>
                        ))
                        ) : (
                        <TableRow>
                            <TableCell colSpan={2} className="text-center">No workers found.</TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>New Transaction</CardTitle>
              <CardDescription>
                Record a new loan or a repayment for a worker.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="labourerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Worker</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a worker" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {labourers.map((labourer) => (
                              <SelectItem key={labourer.id} value={labourer.id}>
                                {labourer.fullName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transaction Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="loan">Give Loan</SelectItem>
                            <SelectItem value="repayment">Record Repayment</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Emergency loan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    <HandCoins className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Recording..." : "Record Transaction"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

    