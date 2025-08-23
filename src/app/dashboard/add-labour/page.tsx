
"use client";

import { useState, useRef, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { UserPlus, Pencil, Trash2, Eye, EyeOff, Upload, Camera, ScanFace } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Labourer, Designation } from "@/types";
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";

const designationValues: [Designation, ...Designation[]] = ["Supervisor", "Skilled Labour", "Unskilled Labour", "Driver", "Office Incharge"];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

const fileSchema = z.any()
  .optional()
  .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)

const imageFileSchema = fileSchema.refine(
    (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
    "Only .jpg, .jpeg, .png and .webp formats are supported."
);

const documentFileSchema = fileSchema.refine(
    (file) => !file || ACCEPTED_DOCUMENT_TYPES.includes(file?.type),
    "Only .jpg, .jpeg, .png and .pdf formats are supported."
);


const labourSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  designation: z.enum(designationValues, { required_error: "Designation is required" }),
  fatherName: z.string().optional(),
  mobile: z.string().optional(),
  dailySalary: z.coerce.number().optional(),
  aadhaar: z.string().optional(),
  pan: z.string().optional(),
  dl: z.string().optional(),
  profilePhoto: imageFileSchema,
  aadhaarFile: documentFileSchema,
  panFile: documentFileSchema,
  dlFile: documentFileSchema,
  faceScanDataUri: z.string().optional(),
});


function FaceScanDialog({ onFaceScan, currentScan }: { onFaceScan: (dataUri: string) => void; currentScan?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const [capturedImage, setCapturedImage] = useState<string | undefined>(currentScan);

  useEffect(() => {
    if (isOpen) {
      setHasCameraPermission(undefined); // Reset on open
      setCapturedImage(currentScan);
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setHasCameraPermission(true);
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings.',
          });
        }
      };
      getCameraPermission();
    } else {
      // Turn off camera when dialog closes
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    }
  }, [isOpen, toast, currentScan]);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUri = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUri);
    }
  };
  
  const handleSave = () => {
    if (capturedImage) {
      onFaceScan(capturedImage);
      setIsOpen(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button" className="w-full">
          <ScanFace className="mr-2" />
          {currentScan || capturedImage ? "View/Retake Face Scan" : "Scan Face"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Enroll Worker Face</DialogTitle>
          <DialogDescription>
            Capture a clear, forward-facing photo of the worker.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-1/2 relative">
                <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
                {hasCameraPermission === false && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
                        <p className="text-white text-center p-4">Camera permission denied. Please enable it in your browser settings.</p>
                    </div>
                )}
                 {hasCameraPermission === undefined && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
                        <p className="text-white">Requesting camera...</p>
                    </div>
                )}
            </div>
            <div className="w-full md:w-1/2">
                <p className="font-semibold mb-2">Captured Image:</p>
                {capturedImage ? (
                    <img src={capturedImage} alt="Captured face" className="w-full aspect-video rounded-md" />
                ) : (
                    <div className="w-full aspect-video rounded-md bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground">No image captured</p>
                    </div>
                )}
            </div>
        </div>

        <DialogFooter>
          <Button onClick={handleCapture} disabled={!hasCameraPermission}>
            <Camera className="mr-2" />
            {capturedImage ? "Retake" : "Capture"}
          </Button>
          <Button onClick={handleSave} disabled={!capturedImage}>Save Face Scan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


interface LabourerFormProps {
  onFinished: () => void;
  labourer?: Labourer | null;
}

function LabourerForm({ onFinished, labourer }: LabourerFormProps) {
  const { addLabourer, updateLabourer } = useData();
  const { toast } = useToast();
  const isEditMode = !!labourer;
  const [isLoading, setIsLoading] = useState(false);

  const profilePhotoRef = useRef<HTMLInputElement>(null);
  const aadhaarFileRef = useRef<HTMLInputElement>(null);
  const panFileRef = useRef<HTMLInputElement>(null);
  const dlFileRef = useRef<HTMLInputElement>(null);


  const form = useForm<z.infer<typeof labourSchema>>({
    resolver: zodResolver(labourSchema),
    defaultValues: {
      fullName: labourer?.fullName || "",
      designation: labourer?.designation,
      fatherName: labourer?.documents.fatherName || "",
      mobile: labourer?.documents.mobile || "",
      dailySalary: labourer?.daily_salary || 0,
      aadhaar: labourer?.documents.aadhaar || "",
      pan: labourer?.documents.pan || "",
      dl: labourer?.documents.dl || "",
      faceScanDataUri: labourer?.face_scan_data_uri || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof labourSchema>) => {
    setIsLoading(true);
    const labourerData = {
      ...values,
      pan: values.pan?.toUpperCase(),
    };

    try {
      if (isEditMode && labourer) {
        await updateLabourer(labourer.id, labourerData);
        toast({
          title: "Success!",
          description: "Worker details have been updated.",
        });
      } else {
        await addLabourer(labourerData);
        toast({
          title: "Success!",
          description: "New worker has been added.",
        });
      }
      form.reset();
      onFinished();
    } catch (error: any) {
       toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
      console.error(error.message || error);
    } finally {
      setIsLoading(false);
    }

  };
  
  const getFileName = (field: "profilePhoto" | "aadhaarFile" | "panFile" | "dlFile") => {
    const file = form.watch(field);
    return file ? file.name : `Select a file`;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
            <h3 className="text-lg font-medium font-headline">Personal Information</h3>
            <hr className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g. Ramesh Kumar" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="designation"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Designation</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a designation" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {designationValues.map(value => (
                            <SelectItem key={value} value={value}>{value}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="fatherName"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Father's Name (Optional)</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g. Suresh Kumar" {...field} />
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
                    <FormLabel>Mobile No. (Optional)</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g. 9876543210" {...field} />
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
                    <FormLabel>Daily Salary (₹) (Optional)</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="e.g. 500" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>
        </div>
        
        <div>
            <h3 className="text-lg font-medium font-headline">Profile & Face Scan</h3>
            <hr className="my-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="profilePhoto"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Profile Photo (Optional)</FormLabel>
                        <FormControl>
                        <div className="w-full">
                            <Input 
                            type="file" 
                            className="hidden"
                            ref={profilePhotoRef}
                            onChange={(e) => field.onChange(e.target.files?.[0])}
                            accept={ACCEPTED_IMAGE_TYPES.join(",")}
                            />
                            <Button type="button" variant="outline" className="w-full" onClick={() => profilePhotoRef.current?.click()}>
                            <Upload className="mr-2 h-4 w-4" />
                            <span className="truncate max-w-[200px]">{getFileName("profilePhoto")}</span>
                            </Button>
                        </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="faceScanDataUri"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>AI Face Recognition</FormLabel>
                        <FormControl>
                        <FaceScanDialog 
                            onFaceScan={(dataUri) => field.onChange(dataUri)}
                            currentScan={field.value}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
            </div>
        </div>

        <div>
            <h3 className="text-lg font-medium font-headline">Documents (Optional)</h3>
            <hr className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="aadhaar"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Aadhaar No.</FormLabel>
                    <FormControl>
                    <Input placeholder="XXXX XXXX XXXX" {...field} />
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
                    <FormLabel>Driving License No.</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g. DL-1420110012345" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>
            
            <h3 className="text-lg font-medium font-headline mt-8">Document Upload (Optional)</h3>
            <hr className="my-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <FormField
                control={form.control}
                name="aadhaarFile"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Aadhaar Document</FormLabel>
                        <FormControl>
                        <div className="w-full">
                            <Input 
                            type="file" 
                            className="hidden"
                            ref={aadhaarFileRef}
                            onChange={(e) => field.onChange(e.target.files?.[0])}
                            accept={ACCEPTED_DOCUMENT_TYPES.join(",")}
                            />
                            <Button type="button" variant="outline" className="w-full" onClick={() => aadhaarFileRef.current?.click()}>
                            <Upload className="mr-2 h-4 w-4" />
                            <span className="truncate max-w-[200px]">{getFileName("aadhaarFile")}</span>
                            </Button>
                        </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="panFile"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>PAN Document</FormLabel>
                        <FormControl>
                        <div className="w-full">
                            <Input 
                            type="file" 
                            className="hidden"
                            ref={panFileRef}
                            onChange={(e) => field.onChange(e.target.files?.[0])}
                            accept={ACCEPTED_DOCUMENT_TYPES.join(",")}
                            />
                            <Button type="button" variant="outline" className="w-full" onClick={() => panFileRef.current?.click()}>
                            <Upload className="mr-2 h-4 w-4" />
                            <span className="truncate max-w-[200px]">{getFileName("panFile")}</span>
                            </Button>
                        </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="dlFile"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>DL Document</FormLabel>
                        <FormControl>
                        <div className="w-full">
                            <Input 
                            type="file" 
                            className="hidden"
                            ref={dlFileRef}
                            onChange={(e) => field.onChange(e.target.files?.[0])}
                            accept={ACCEPTED_DOCUMENT_TYPES.join(",")}
                            />
                            <Button type="button" variant="outline" className="w-full" onClick={() => dlFileRef.current?.click()}>
                            <Upload className="mr-2 h-4 w-4" />
                            <span className="truncate max-w-[200px]">{getFileName("dlFile")}</span>
                            </Button>
                        </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
            </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Worker'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default function LabourerManagementPage() {
  const { labourers, deleteLabourer, loading, error } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editLabourer, setEditLabourer] = useState<Labourer | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showSalary, setShowSalary] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const handleEditClick = (labourer: Labourer) => {
    setEditLabourer(labourer);
    setIsEditDialogOpen(true);
  }

  const handleDelete = async (labourerId: string) => {
    try {
      await deleteLabourer(labourerId);
      toast({
        title: "Worker Deleted",
        description: "The worker has been removed from the system.",
        variant: "destructive",
      });
    } catch {
       toast({
        title: "Error Deleting Worker",
        description: "Could not remove worker. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-8">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-headline font-bold tracking-tight">
          Worker Management
        </h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Worker
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Worker</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new worker to the system.
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
           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <CardTitle>All Workers</CardTitle>
              <CardDescription>View and manage all registered workers.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowSalary(!showSalary)}>
              {showSalary ? <EyeOff className="mr-2" /> : <Eye className="mr-2" />}
              {showSalary ? 'Hide' : 'Show'} Salary
            </Button>
          </div>
        </CardHeader>
        <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profile</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead className="hidden sm:table-cell">Mobile No.</TableHead>
                  <TableHead className="hidden md:table-cell">Face Scan</TableHead>
                  {showSalary && <TableHead className="hidden lg:table-cell">Daily Salary (₹)</TableHead>}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={showSalary ? 7 : 6} className="text-center">
                      Loading workers...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                   <TableRow>
                    <TableCell colSpan={showSalary ? 7 : 6} className="text-center text-red-500">
                      Error loading workers. Please check your connection and refresh.
                    </TableCell>
                  </TableRow>
                ) : labourers.length > 0 ? (
                  labourers.map((labourer) => (
                    <TableRow key={labourer.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={labourer.profile_photo_url} alt={labourer.fullName} data-ai-hint="profile person" />
                          <AvatarFallback>
                            {labourer.fullName?.charAt(0) || 'W'}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap">
                        {labourer.fullName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{labourer.designation}</Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{labourer.documents.mobile}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {labourer.face_scan_data_uri ? (
                            <Badge variant="default">Enrolled</Badge>
                        ) : (
                            <Badge variant="outline">Not Enrolled</Badge>
                        )}
                      </TableCell>
                       {showSalary && <TableCell className="hidden lg:table-cell">{labourer.daily_salary}</TableCell>}
                      <TableCell className="text-right">
                         <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-1">
                             <Button variant="outline" size="sm" onClick={() => handleEditClick(labourer)}>
                              <Pencil className="h-4 w-4 sm:mr-2" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                 <Button variant="destructive" size="sm">
                                    <Trash2 className="h-4 w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Delete</span>
                                  </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the
                                    worker and all their associated data from the database.
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
                         </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={showSalary ? 7 : 6} className="text-center">
                      No workers added yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Worker Details</DialogTitle>
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
