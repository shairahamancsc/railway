
"use client";

import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { UserPlus, Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Labourer } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

interface LabourerFormProps {
  onFinished: () => void;
  labourer?: Labourer | null;
}

function LabourerForm({ onFinished, labourer }: LabourerFormProps) {
  const { addLabourer, updateLabourer } = useData();
  const { toast } = useToast();
  const isEditMode = !!labourer;

  const form = useForm<z.infer<typeof labourSchema>>({
    resolver: zodResolver(labourSchema),
    defaultValues: {
      fullName: labourer?.fullName || "",
      fatherName: labourer?.fatherName || "",
      mobile: labourer?.mobile || "",
      dailySalary: labourer?.dailySalary || 0,
      aadhaar: labourer?.aadhaar || "",
      pan: labourer?.pan || "",
      dl: labourer?.dl || "",
      profilePhotoUrl: labourer?.profilePhotoUrl || "",
      aadhaarUrl: labourer?.documents?.aadhaarUrl || "",
      panUrl: labourer?.documents?.panUrl || "",
      dlUrl: labourer?.documents?.dlUrl || "",
    },
  });

  const onSubmit = (values: z.infer<typeof labourSchema>) => {
    const labourerData = {
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
    };

    if (isEditMode && labourer) {
      updateLabourer(labourer.id, labourerData);
       toast({
        title: "Success!",
        description: "Labourer details have been updated.",
      });
    } else {
      addLabourer(labourerData);
      toast({
        title: "Success!",
        description: "New labourer has been added.",
      });
    }

    form.reset();
    onFinished();
  };

  return (
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
          <Button type="submit">{isEditMode ? 'Save Changes' : 'Add Labourer'}</Button>
        </div>
      </form>
    </Form>
  )
}

export default function LabourerManagementPage() {
  const { labourers, deleteLabourer } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editLabourer, setEditLabourer] = useState<Labourer | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleEditClick = (labourer: Labourer) => {
    setEditLabourer(labourer);
    setIsEditDialogOpen(true);
  }

  const handleDelete = (labourerId: string) => {
    deleteLabourer(labourerId);
    toast({
      title: "Labourer Deleted",
      description: "The labourer has been removed from the system.",
      variant: "destructive",
    });
  }

  return (
    <div className="space-y-8">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-headline font-bold tracking-tight">
          Labourer Management
        </h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Labourer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Labourer</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new labourer to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <LabourerForm onFinished={() => setIsAddDialogOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Labourers</CardTitle>
           <CardDescription>View and manage all registered labourers.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profile</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Mobile No.</TableHead>
                  <TableHead className="hidden md:table-cell">Daily Salary</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labourers.length > 0 ? (
                  labourers.map((labourer) => (
                    <TableRow key={labourer.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={labourer.profilePhotoUrl} alt={labourer.fullName} data-ai-hint="profile person" />
                          <AvatarFallback>
                            {labourer.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap">
                        {labourer.fullName}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{labourer.mobile}</TableCell>
                       <TableCell className="hidden md:table-cell">₹{labourer.dailySalary}</TableCell>
                      <TableCell className="text-right space-x-2 whitespace-nowrap">
                         <Button variant="outline" size="sm" onClick={() => handleEditClick(labourer)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <Button variant="destructive" size="sm">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the
                                labourer and all their associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(labourer.id)}>
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No labourers added yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Labourer Details</DialogTitle>
            <DialogDescription>
              Update the information for {editLabourer?.fullName}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
             {editLabourer && <LabourerForm onFinished={() => setIsEditDialogOpen(false)} labourer={editLabourer} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
