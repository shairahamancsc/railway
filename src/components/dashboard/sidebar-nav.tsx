
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  LayoutDashboard,
  UserPlus,
  CalendarCheck,
  Users,
  FileText,
  LogOut,
  UserCheck as BrandIcon,
  Menu,
  Code,
  Archive,
  Landmark,
  Palette,
  Newspaper,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/add-labour", icon: UserPlus, label: "Add Worker" },
  { href: "/dashboard/attendance", icon: CalendarCheck, label: "Attendance" },
  { href: "/dashboard/supervisors", icon: Users, label: "Supervisors" },
  { href: "/dashboard/loans", icon: Landmark, label: "Loans" },
  { href: "/dashboard/reports", icon: FileText, label: "Reports" },
  { href: "/dashboard/settlements", icon: Archive, label: "Settlements" },
  { href: "/dashboard/products", icon: Package, label: "Products"},
  { href: "/dashboard/blog", icon: Newspaper, label: "Blog" },
  { href: "/dashboard/theme", icon: Palette, label: "Theme" },
  { href: "/dashboard/api", icon: Code, label: "API" },
];

function SidebarContentNav({ onLinkClick }: { onLinkClick?: () => void }) {
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
    if (onLinkClick) {
      onLinkClick();
    }
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname !== href && onLinkClick) {
      onLinkClick();
    } else if (pathname === href && onLinkClick) {
      onLinkClick();
    }
  };


  return (
    <div className="flex h-full flex-col">
       <div className="flex h-14 shrink-0 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BrandIcon className="h-6 w-6" />
          <span className="">JRKE Labour Utility</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start px-2 py-4 text-sm font-medium lg:px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item.href)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard') ? "bg-muted text-primary" : ""
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto shrink-0 border-t p-4">
        <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button size="sm" className="w-full" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
            </Button>
        </div>
      </div>
    </div>
  );
}


export function SidebarNav() {
  return (
    <SidebarContentNav />
  );
}

function MobileHeaderTitle() {
    const pathname = usePathname();
    const [title, setTitle] = useState("");
    const [target, setTarget] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setTarget(document.getElementById("mobile-header-title"));
    }, []);

    useEffect(() => {
        let currentLabel = "Dashboard"; 
        if (pathname.includes('/settlements/')) {
            currentLabel = "Settlement Details";
        } else {
            const currentNavItem = navItems.find(item => pathname.startsWith(item.href) && item.href !== '/dashboard');
            if (pathname === '/dashboard') {
              currentLabel = "Dashboard";
            } else if (currentNavItem) {
                currentLabel = currentNavItem.label;
            }
        }
        setTitle(currentLabel);
    }, [pathname]);

    if (!target) {
        return null;
    }

    return createPortal(title, target);
}


export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SidebarContentNav onLinkClick={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>
      <MobileHeaderTitle />
    </>
  )
}
