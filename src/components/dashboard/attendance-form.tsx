
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
import { Camera, ScanFace, Loader2, Search } from "lucide-react";
import type { AttendanceFormProps, AttendanceState } from "@/types";
import { compareFaces } from "@/ai/flows/compare-faces-flow";


function FaceRecognitionDialog({ onFaceRecognized }: { onFaceRecognized: (labourerId: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState("Please wait...");
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const { labourers, getLabourerById } = useData();

  useEffect(() => {
    if (isOpen) {
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
           toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings.',
          });
        }
      };
      getCameraPermission();

    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    }
  }, [isOpen, toast]);

  const handleScan = async () => {
    if (!videoRef.current) return;
    
    setIsProcessing(true);
    setProcessingText('Capturing image...');

    // Capture a frame from the video stream
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const capturedFaceDataUri = canvas.toDataURL('image/jpeg');

    setProcessingText('Analyzing face...');

    try {
        const result = await compareFaces({ capturedFaceDataUri });

        if (result.matchFound && result.labourerId) {
            const matchedWorker = getLabourerById(result.labourerId);
            onFaceRecognized(result.labourerId);
            toast({
                title: 'Attendance Marked!',
                description: `${matchedWorker?.fullName || 'Worker'} marked as present. (Confidence: ${(result.confidence! * 100).toFixed(0)}%)`,
            });
            setIsOpen(false);
        } else {
             toast({
                variant: 'destructive',
                title: 'No Match Found',
                description: `Could not identify the worker. Please ensure they are enrolled and the lighting is good.`,
            });
        }

    } catch (error: any) {
        console.error("Face recognition error:", error);
        toast({
            variant: 'destructive',
            title: 'AI Error',
            description: error.message || 'An unexpected error occurred during face recognition.',
        });
    } finally {
        setIsProcessing(false);
        setProcessingText("");
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ScanFace className="mr-2" />Scan Face for Attendance
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
          <Button onClick={handleScan} disabled={!hasCameraPermission || isProcessing}>
            {isProcessing ? <><Loader2 className="animate-spin mr-2" /> {processingText}</> : <><ScanFace /> Scan & Mark Present</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export function AttendanceForm({ targetDate, onSave }: AttendanceFormProps) {
  const { labourers, attendance, markAttendance, loading } = useData();
  const { toast } = useToast();

  const dateStr = useMemo(() => format(targetDate, "yyyy-MM-dd"), [targetDate]);

  const [attendanceData, setAttendanceData] = useState<Map<string, AttendanceState>>(new Map());
  const [workDetails, setWorkDetails] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");

  const workerGroups = useMemo(() => {
    const groups = new Set(labourers.map(l => l.group).filter(Boolean));
    return ["all", ...Array.from(groups)];
  }, [labourers]);

  useEffect(() => {
    // Only set initial state when data is not loading anymore
    if (!loading) {
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
    } else {
        setIsLoaded(false);
    }
  }, [attendance, labourers, dateStr, loading]);

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

  const filteredLabourers = useMemo(() => {
    return labourers.filter(labourer => {
      const matchesSearch = labourer.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGroup = selectedGroup === 'all' || labourer.group === selectedGroup;
      return matchesSearch && matchesGroup;
    });
  }, [labourers, searchTerm, selectedGroup]);

  if (!isLoaded || loading) {
    return (
      <div className="space-y-8">
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
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search"
              placeholder="Search workers..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex w-full sm:w-auto items-center gap-2">
              <FaceRecognitionDialog onFaceRecognized={handleFaceRecognized} />
              {labourers.length > 0 && (
                  <Button onClick={handleSaveAttendance} className="w-full">Save Attendance</Button>
              )}
          </div>
        </div>
        {workerGroups.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {workerGroups.map(group => (
              <Button 
                key={group} 
                variant={selectedGroup === group ? "default" : "outline"}
                onClick={() => setSelectedGroup(group)}
                className="capitalize"
              >
                {group}
              </Button>
            ))}
          </div>
        )}
      </div>

      {labourers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLabourers.map((labourer) => (
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
          {filteredLabourers.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">
                  No workers found matching your search or filter.
                </p>
              </CardContent>
            </Card>
          )}
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

    