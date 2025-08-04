
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
  UserCheck as BrandIcon,
  Menu,
  Notebook,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/add-labour", icon: UserPlus, label: "Add Worker" },
  { href: "/dashboard/attendance", icon: CalendarCheck, label: "Attendance" },
  { href: "/dashboard/supervisors", icon: Users, label: "Supervisors" },
  { href: "/dashboard/reports", icon: FileText, label: "Reports" },
  { href: "/dashboard/notes", icon: Notebook, label: "Notes" },
  { href: "/dashboard/api", icon: Code, label: "API" },
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
    <div className="flex h-full flex-col gap-2">
       <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BrandIcon className="h-6 w-6" />
          <span className="">AttendEase</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                pathname === item.href ? "bg-muted text-primary" : ""
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button size="sm" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
        </Button>
      </div>
    </div>
  );
}


export function SidebarNav() {
  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <SidebarContentNav />
    </div>
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
         <SidebarContentNav />
      </SheetContent>
    </Sheet>
  )
}
