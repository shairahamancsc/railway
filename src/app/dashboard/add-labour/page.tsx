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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/hooks/useData";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const labourSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  fatherName: z.string().min(2, "Father's name must be at least 2 characters"),
  mobile: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits"),
  dailySalary: z.coerce.number().min(0, "Salary must be a positive number"),
  aadhaar: z.string().regex(/^\d{12}$/, "Aadhaar number must be 12 digits"),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
  dl: z.string().optional(),
  profilePhotoUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  aadhaarUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  panUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  dlUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

export default function AddLabourPage() {
  const { addLabourer } = useData();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof labourSchema>>({
    resolver: zodResolver(labourSchema),
    defaultValues: {
      fullName: "",
      fatherName: "",
      mobile: "",
      dailySalary: 0,
      aadhaar: "",
      pan: "",
      dl: "",
      profilePhotoUrl: "",
      aadhaarUrl: "",
      panUrl: "",
      dlUrl: "",
    },
  });

  const onSubmit = (values: z.infer<typeof labourSchema>) => {
    addLabourer({
      fullName: values.fullName,
      fatherName: values.fatherName,
      mobile: values.mobile,
      dailySalary: values.dailySalary,
      aadhaar: values.aadhaar,
      pan: values.pan.toUpperCase(),
      dl: values.dl || "",
      profilePhotoUrl: values.profilePhotoUrl || "https://placehold.co/100x100.png",
      documents: {
        aadhaarUrl: values.aadhaarUrl || "",
        panUrl: values.panUrl || "",
        dlUrl: values.dlUrl || "",
      },
    });
    toast({
      title: "Success!",
      description: "New labourer has been added.",
    });
    form.reset();
    router.push("/dashboard");
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold tracking-tight">
        Add New Labourer
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Labourer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fatherName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Father's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Richard Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile No.</FormLabel>
                      <FormControl>
                        <Input placeholder="9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dailySalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Salary (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profilePhotoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Photo URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/photo.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-medium font-headline border-t pt-6">Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="aadhaar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aadhaar No.</FormLabel>
                      <FormControl>
                        <Input placeholder="123456789012" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PAN Card No.</FormLabel>
                      <FormControl>
                        <Input placeholder="ABCDE1234F" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driving License No. (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="DL-1420110012345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <h3 className="text-lg font-medium font-headline border-t pt-6">Document Upload (Links)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="aadhaarUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aadhaar Document URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/aadhaar.pdf" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="panUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PAN Document URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/pan.pdf" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dlUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DL Document URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/dl.pdf" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit">Add Labourer</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
