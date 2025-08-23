
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

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>AttendEase</title>
        <meta name="description" content="Labour Attendance Web App" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png"></link>
        <meta name="theme-color" content="#3F51B5" />
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
