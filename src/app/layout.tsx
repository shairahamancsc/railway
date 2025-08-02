"use client"

import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import useSmoothScroll from "@/hooks/use-smooth-scroll";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useSmoothScroll();

  useEffect(() => {
    document.title = "AttendEase";
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute("content", "Labour Attendance Web App");
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Labour Attendance Web App';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body
        className="font-body antialiased"
        suppressHydrationWarning={true}
      >
        {children}
        <Analytics />
        <SpeedInsights />
        <Toaster />
      </body>
    </html>
  );
}
