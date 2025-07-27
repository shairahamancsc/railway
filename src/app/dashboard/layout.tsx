"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DataProvider } from "@/context/DataProvider";
import { SidebarNav, MobileSidebar } from "@/components/dashboard/sidebar-nav";
import { Skeleton } from "@/components/ui/skeleton";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarProvider } from "@/components/ui/sidebar";

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
        <div className="flex min-h-screen w-full">
            <div className="hidden md:block">
                <Skeleton className="h-full w-64" />
            </div>
            <div className="flex-1 p-8">
                <Skeleton className="h-16 w-full mb-8" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    )
  }

  return (
    <DataProvider>
      <SidebarProvider>
        <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr]">
          <div className="hidden border-r bg-card md:block">
            <SidebarNav />
          </div>
          <div className="flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 md:hidden no-print">
              <MobileSidebar />
            </header>
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </DataProvider>
  );
}
