
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, UserCheck } from 'lucide-react';
import { ThemeToggle } from '../dashboard/theme-toggle';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/#services', label: 'Services' },
  { href: '/#products', label: 'Products' },
  { href: '/about', label: 'About Us' },
  { href: '/blog', label: 'Blog' },
  { href: '/#contact', label: 'Contact' },
];

export function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const sectionIds = navLinks
        .map(link => link.href.split('/#')[1])
        .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  const handleLinkClick = (href: string) => {
    setIsSheetOpen(false);
    if (href.startsWith('/#')) {
      const sectionId = href.substring(2);
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <UserCheck className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg">JRKE Contracting</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
             <Link 
              key={link.href} 
              href={link.href} 
              onClick={(e) => {
                if (link.href.startsWith('/#')) {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }
              }}
              className={cn(
                "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                `/${'#' + activeSection}` === link.href && "text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Button asChild>
                <Link href="/login">Admin Login</Link>
            </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col h-full">
                <div className="border-b pb-4">
                    <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setIsSheetOpen(false)}>
                        <UserCheck className="h-6 w-6 text-primary" />
                        <span className="font-headline text-lg">JRKE Contracting</span>
                    </Link>
                </div>
                <nav className="flex flex-col gap-4 py-4">
                  {navLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-muted-foreground hover:text-primary"
                      onClick={(e) => {
                         if (link.href.startsWith('/#')) {
                           e.preventDefault();
                           handleLinkClick(link.href);
                         } else {
                            setIsSheetOpen(false);
                         }
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto space-y-2">
                    <Button asChild className="w-full">
                        <Link href="/login">Admin Login</Link>
                    </Button>
                    <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
