
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { UserCheck } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-sm mx-auto shadow-xl rounded-lg bg-card">
          <div className="text-center p-4 sm:p-6">
             <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserCheck className="h-8 w-8" />
            </div>
             <Skeleton className="h-7 w-3/4 mx-auto mb-2" />
             <Skeleton className="h-5 w-1/2 mx-auto" />
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
            </div>
             <Skeleton className="h-10 w-full" />
          </div>
      </div>
    </div>
  );
}

    