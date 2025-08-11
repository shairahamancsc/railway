
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { format } from "date-fns";
import { useData } from "@/hooks/useData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { AttendanceStatus, DailyLabourerRecord } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Camera, ScanFace, Loader2 } from "lucide-react";
import { recognizeWorkerFace } from "@/ai/flows/recognize-face-flow";


type AttendanceState = Omit<DailyLabourerRecord, "labourerId">;

interface AttendanceFormProps {
  targetDate: Date;
  onSave?: () => void;
}

function FaceRecognitionDialog({ onFaceRecognized }: { onFaceRecognized: (labourerId: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const { labourers } = useData();

  const enrolledWorkers = useMemo(() => {
      return labourers
          .filter(l => l.face_scan_data_uri)
          .map(l => ({ labourerId: l.id, faceScanDataUri: l.face_scan_data_uri! }));
  }, [labourers]);


  useEffect(() => {
    if (isOpen) {
      setHasCameraPermission(undefined); // Reset on open
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
        }
      };
      getCameraPermission();
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    }
  }, [isOpen]);

  const handleScan = async () => {
    if (!videoRef.current) return;
    
    setIsProcessing(true);

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const capturedFaceDataUri = canvas.toDataURL('image/jpeg');

    try {
        if (enrolledWorkers.length === 0) {
            toast({
                variant: 'destructive',
                title: 'No Workers Enrolled',
                description: 'Please enroll workers for face recognition in the "Add Worker" page first.',
            });
            return;
        }

        const result = await recognizeWorkerFace({
            capturedFaceDataUri,
            enrolledWorkers
        });

        if (result.labourerId && result.confidence > 0.8) {
            onFaceRecognized(result.labourerId);
            const worker = labourers.find(l => l.id === result.labourerId);
            toast({
                title: 'Attendance Marked!',
                description: `${worker?.fullName} has been marked as present. (${(result.confidence * 100).toFixed(0)}% confidence)`,
            });
            setIsOpen(false);
        } else {
             toast({
                variant: 'destructive',
                title: 'No Match Found',
                description: result.reasoning || "Could not identify the worker. Please try again or mark attendance manually.",
            });
        }

    } catch (error) {
        console.error("Face recognition error:", error);
        toast({
            variant: 'destructive',
            title: 'AI Error',
            description: 'The face recognition service failed. Please try again.',
        });
    } finally {
        setIsProcessing(false);
    }

  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><ScanFace className="mr-2" />Scan Face for Attendance</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Face Recognition</DialogTitle>
          <DialogDescription>
            Position the worker's face in the frame and click scan.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative">
            <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
            {hasCameraPermission === false && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
                    <p className="text-white text-center p-4">Camera permission denied. Please enable it in your browser settings.</p>
                </div>
            )}
            {isProcessing && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-md">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-white mt-4">Analyzing... Please wait.</p>
                </div>
            )}
        </div>

        <DialogFooter>
          <Button onClick={handleScan} disabled={!hasCameraPermission || isProcessing}>
            {isProcessing ? <><Loader2 className="animate-spin" /> Processing...</> : <><ScanFace /> Scan & Mark Present</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export function AttendanceForm({ targetDate, onSave }: AttendanceFormProps) {
  const { labourers, attendance, markAttendance } = useData();
  const { toast } = useToast();

  const dateStr = useMemo(() => format(targetDate, "yyyy-MM-dd"), [targetDate]);

  const [attendanceData, setAttendanceData] = useState<Map<string, AttendanceState>>(new Map());
  const [workDetails, setWorkDetails] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const targetAttendanceRecord = attendance.find((a) => a.date === dateStr);
    const initialData = new Map<string, AttendanceState>();

    if (labourers.length > 0) {
      labourers.forEach((labourer) => {
        const record = targetAttendanceRecord?.records?.find(
          (r) => r.labourerId === labourer.id
        );
        initialData.set(
          labourer.id,
          record || { status: "absent", advance: 0, remarks: "" }
        );
      });
    }
    setAttendanceData(initialData);
    setWorkDetails(targetAttendanceRecord?.workDetails || "");
    setIsLoaded(true);
  }, [attendance, labourers, dateStr]);

  const handleAttendanceChange = (
    labourerId: string,
    field: keyof AttendanceState,
    value: string | number
  ) => {
    setAttendanceData((prev) => {
      const newMap = new Map(prev);
      const currentRecord = newMap.get(labourerId) || {
        status: "absent",
        advance: 0,
        remarks: "",
      };
      // @ts-ignore
      currentRecord[field] = value;
      newMap.set(labourerId, currentRecord);
      return newMap;
    });
  };

  const handleFaceRecognized = (labourerId: string) => {
    // Mark the recognized worker as present
    handleAttendanceChange(labourerId, 'status', 'present');
  }

  const handleSaveAttendance = () => {
    const records: DailyLabourerRecord[] = Array.from(
      attendanceData.entries()
    ).map(([labourerId, state]) => ({
      labourerId,
      ...state,
    }));
    markAttendance(dateStr, records, workDetails);
    toast({
      title: "Attendance Saved",
      description: `Attendance for ${format(targetDate, "dd MMMM, yyyy")} has been updated.`,
    });
    if (onSave) {
        onSave();
    }
  };

  if (!isLoaded) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
              <Skeleton className="h-9 w-64 mb-2" />
              <Skeleton className="h-5 w-48" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-headline font-bold tracking-tight">
                Mark Attendance
            </h1>
            <p className="text-muted-foreground">
                {format(targetDate, "EEEE, dd MMMM, yyyy")}
            </p>
        </div>
        <div className="flex items-center gap-2">
           <FaceRecognitionDialog onFaceRecognized={handleFaceRecognized} />
          {labourers.length > 0 && (
              <Button onClick={handleSaveAttendance}>Save Attendance</Button>
          )}
        </div>
      </div>

      {labourers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {labourers.map((labourer) => (
              <Card key={labourer.id} className={attendanceData.get(labourer.id)?.status === 'present' ? 'border-primary' : ''}>
                <CardHeader className="flex flex-col items-center gap-2 pb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={labourer.profile_photo_url}
                      data-ai-hint="profile person"
                    />
                    <AvatarFallback className="text-2xl">
                      {labourer.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg text-center">{labourer.fullName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                          value={
                            attendanceData.get(labourer.id)?.status || "absent"
                          }
                          onValueChange={(value: AttendanceStatus) =>
                            handleAttendanceChange(
                              labourer.id,
                              "status",
                              value
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="absent">Absent</SelectItem>
                            <SelectItem value="half-day">Half Day</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                       <AccordionItem value="advance" className="border-b-0">
                          <AccordionTrigger className="flex w-full items-center justify-center rounded-md border border-input bg-background py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground hover:no-underline">
                              <span>Advance & Remarks</span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-1 gap-4 pt-4">
                                  <div className="space-y-2">
                                      <Label htmlFor={`advance-${labourer.id}`}>Advance Amount (₹)</Label>
                                      <Input
                                        id={`advance-${labourer.id}`}
                                        type="number"
                                        placeholder="Enter amount"
                                        value={attendanceData.get(labourer.id)?.advance || ''}
                                        onChange={(e) => handleAttendanceChange(labourer.id, 'advance', e.target.valueAsNumber || 0)}
                                      />
                                  </div>
                                  <div className="space-y-2">
                                      <Label htmlFor={`remarks-${labourer.id}`}>Remarks</Label>
                                      <Textarea
                                        id={`remarks-${labourer.id}`}
                                        placeholder="Enter remarks"
                                        value={attendanceData.get(labourer.id)?.remarks || ''}
                                        onChange={(e) => handleAttendanceChange(labourer.id, 'remarks', e.target.value)}
                                      />
                                  </div>
                              </div>
                          </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Work Details for Today</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Describe the work done today..."
                value={workDetails}
                onChange={(e) => setWorkDetails(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>
        </>
      ) : (
         <Card>
            <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">
                  No workers to mark attendance for. Please add a worker first.
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
