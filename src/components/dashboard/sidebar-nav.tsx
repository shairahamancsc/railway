"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UserPlus,
  CalendarCheck,
  Users,
  FileText,
  LogOut,
  UserCheck,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/add-labour", icon: UserPlus, label: "Add Labour" },
  { href: "/dashboard/attendance", icon: CalendarCheck, label: "Attendance" },
  { href: "/dashboard/supervisors", icon: Users, label: "Supervisors" },
  { href: "/dashboard/reports", icon: FileText, label: "Reports" },
];

function SidebarContentNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push("/login");
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UserCheck className="h-6 w-6" />
            </div>
            <h1 className="font-headline text-2xl font-semibold">AttendEase</h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  className="w-full"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </>
  );
}


export function SidebarNav() {
  return (
    <Sidebar className="border-r no-print">
      <SidebarContentNav />
    </Sidebar>
  );
}

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col p-0">
         <Sidebar className="border-r-0">
           <SidebarContentNav />
         </Sidebar>
      </SheetContent>
    </Sheet>
  )
}