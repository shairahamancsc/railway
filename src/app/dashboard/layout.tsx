
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DataProvider } from "@/context/DataProvider";
import { SidebarNav, MobileSidebar } from "@/components/dashboard/sidebar-nav";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("auth-token") === "authenticated";
    if (!isAuthenticated) {
      router.replace("/login");
    } else {
      setIsAuthChecked(true);
    }
  }, [router]);

  if (!isAuthChecked) {
    return (
      <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr]">
        <div className="hidden border-r bg-card md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Skeleton className="h-6 w-48" />
                </div>
                <div className="flex-1 p-4 space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            </div>
        </div>
        <div className="flex flex-col">
           <header className="flex h-14 items-center justify-between gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
             <Skeleton className="h-8 w-8 md:hidden" />
             <Skeleton className="h-6 w-32 md:hidden" />
             <div className="w-8" />
           </header>
           <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-secondary/40">
                <Skeleton className="h-64 w-full" />
           </main>
        </div>
      </div>
    );
  }

  return (
    <DataProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr]">
        <aside className="hidden border-r bg-card md:block">
          <SidebarNav />
        </aside>
        <div className="flex flex-col">
          <header className="flex h-14 items-center justify-between gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 no-print">
            <MobileSidebar />
            <div id="mobile-header-title" className="text-lg font-semibold md:hidden" />
            <div className="w-8" /> 
          </header>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-secondary/40">
            <div className="mx-auto w-full max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </DataProvider>
  );
}

    