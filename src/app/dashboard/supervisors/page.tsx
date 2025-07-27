"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useData } from "@/hooks/useData";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const supervisorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export default function SupervisorsPage() {
  const { supervisors, addSupervisor } = useData();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof supervisorSchema>>({
    resolver: zodResolver(supervisorSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = (values: z.infer<typeof supervisorSchema>) => {
    addSupervisor({ name: values.name });
    toast({
      title: "Supervisor Added",
      description: `${values.name} has been added to the list.`,
    });
    form.reset();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold tracking-tight">
        Manage Supervisors
      </h1>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add New Supervisor</CardTitle>
            <CardDescription>Enter the name of the new supervisor.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supervisor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Mike Ross" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Add Supervisor</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supervisor List</CardTitle>
             <CardDescription>A list of all registered supervisors.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date Added</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supervisors.length > 0 ? (
                    supervisors.map((supervisor) => (
                      <TableRow key={supervisor.id}>
                        <TableCell className="font-medium whitespace-nowrap">{supervisor.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                              {format(new Date(supervisor.createdAt), "PPP")}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center">
                        No supervisors added yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
