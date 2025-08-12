
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { format } from "date-fns";
import * as faceapi from 'face-api.js';
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
import type { AttendanceFormProps, AttendanceState } from "@/types";


type LabeledFaceDescriptors = {
    label: string;
    descriptors: Float32Array[];
}

function FaceRecognitionDialog({ onFaceRecognized }: { onFaceRecognized: (labourerId: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState("Analyzing... Please wait.");
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState<faceapi.LabeledFaceDescriptors[] | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const { labourers } = useData();

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
      try {
        setProcessingText('Loading AI models...');
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        setModelsLoaded(true);
        toast({ title: "AI Ready", description: "Face recognition models loaded."});
      } catch (error) {
         console.error("Error loading face-api models", error);
         toast({ title: "AI Error", description: "Could not load face recognition models.", variant: "destructive"});
      }
    };
    loadModels();
  }, [toast]);

  const loadLabeledImages = async () => {
        const enrolledWorkers = labourers.filter(l => l.face_scan_data_uri);
        if (enrolledWorkers.length === 0) {
          toast({title: "No Faces Enrolled", description: "Please enroll workers in the 'Add Worker' page first.", variant: "destructive"});
          return [];
        }

        return Promise.all(
            enrolledWorkers.map(async (worker) => {
                const descriptions = [];
                try {
                    const img = await faceapi.fetchImage(worker.face_scan_data_uri!);
                    const detections = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
                    if (detections) {
                        descriptions.push(detections.descriptor);
                    }
                } catch (error) {
                    console.error(`Could not process image for ${worker.fullName}`, error);
                }
                return new faceapi.LabeledFaceDescriptors(worker.id, descriptions);
            })
        );
    }

  useEffect(() => {
    if (isOpen && modelsLoaded) {
      setProcessingText('Preparing enrolled faces...');
      setIsProcessing(true);
      loadLabeledImages().then(descriptors => {
        setLabeledFaceDescriptors(descriptors.filter(d => d.descriptors.length > 0));
        setIsProcessing(false);
        setProcessingText('');
      });
      
      setHasCameraPermission(undefined);
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
  }, [isOpen, modelsLoaded, labourers, toast]);

  const handleScan = async () => {
    if (!videoRef.current || !labeledFaceDescriptors) return;
    
    setIsProcessing(true);
    setProcessingText('Detecting face...');

    try {
        const displaySize = { width: videoRef.current.clientWidth, height: videoRef.current.clientHeight };
        
        const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
        
        if (detections.length === 0) {
             toast({ title: "No Face Detected", description: "Please position the face clearly in the camera.", variant: "destructive" });
             return;
        }
        if (detections.length > 1) {
            toast({ title: "Multiple Faces Detected", description: "Please ensure only one person is in the frame.", variant: "destructive" });
            return;
        }

        setProcessingText('Comparing faces...');
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);
        const bestMatch = faceMatcher.findBestMatch(detections[0].descriptor);
        const matchedWorker = labourers.find(l => l.id === bestMatch.label);


        if (bestMatch.label !== 'unknown' && matchedWorker) {
            onFaceRecognized(bestMatch.label);
            toast({
                title: 'Attendance Marked!',
                description: `${matchedWorker.fullName} has been marked as present. (Confidence: ${(1 - bestMatch.distance).toFixed(2)})`,
            });
            setIsOpen(false);
        } else {
             toast({
                variant: 'destructive',
                title: 'No Match Found',
                description: `Could not identify the worker.`,
            });
        }

    } catch (error) {
        console.error("Face recognition error:", error);
        toast({
            variant: 'destructive',
            title: 'AI Error',
            description: 'An unexpected error occurred during face recognition.',
        });
    } finally {
        setIsProcessing(false);
        setProcessingText("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={!modelsLoaded}><ScanFace className="mr-2" />
        { !modelsLoaded ? "Loading AI..." : "Scan Face for Attendance" }
        </Button>
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
                    <p className="text-white mt-4 text-center">{processingText}</p>
                </div>
            )}
        </div>

        <DialogFooter>
          <Button onClick={handleScan} disabled={!hasCameraPermission || isProcessing || !labeledFaceDescriptors}>
            {isProcessing ? <><Loader2 className="animate-spin mr-2" /> {processingText}</> : <><ScanFace /> Scan & Mark Present</>}
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

    