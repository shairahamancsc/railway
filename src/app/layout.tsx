
"use client"

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Inter, Space_Grotesk as SpaceGrotesk } from 'next/font/google'
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import useSmoothScroll from "@/hooks/use-smooth-scroll";
import { ThemeProvider } from "@/components/theme-provider";

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

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <title>JRKE Labour Management Utility</title>
        <meta name="description" content="JRKE Labour Management Utility" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png"></link>
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
