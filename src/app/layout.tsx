
"use client"

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Inter, Space_Grotesk as SpaceGrotesk } from 'next/font/google'
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import useSmoothScroll from "@/hooks/use-smooth-scroll";
import { ThemeProvider } from "@/components/theme-provider";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const spaceGrotesk = SpaceGrotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useSmoothScroll();
  const pathname = usePathname();
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const canonicalUrl = origin + pathname;

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <title>JRKE Labour Management Utility - Simplified Workforce Management</title>
        <meta name="description" content="Efficiently manage worker attendance, payroll, and loans with the JRKE Labour Management Utility. Streamline your operations with AI-powered face recognition and detailed reporting." />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png"></link>
        <meta name="theme-color" content="#3F51B5" />
        <meta name="google-site-verification" content="oEH0uuMTn5LfTSRZSgCMrNK7s727uY5Jsgpm1DLmYDs" />
      </head>
      <body
        className="font-body antialiased"
        suppressHydrationWarning={true}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
            <Analytics />
            <SpeedInsights />
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
