
"use client"

import type { Metadata } from 'next'
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

const AppMetadata: Metadata = {
  metadataBase: new URL('https://www.jrkelabour.com'),
  title: {
    default: 'JRKE Labour Management Utility - Simplified Workforce Management',
    template: '%s | JRKE Labour Management Utility',
  },
  description: "Efficiently manage worker attendance, payroll, and loans with the JRKE Labour Management Utility. Streamline your operations with AI-powered face recognition and detailed reporting.",
  openGraph: {
    title: 'JRKE Labour Management Utility',
    description: 'Simplified workforce management for construction and contracting.',
    url: 'https://www.jrkelabour.com',
    siteName: 'JRKE Labour Management',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JRKE Labour Management Utility',
    description: 'Simplified workforce management for construction and contracting.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

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

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "JRKE Labour Management Utility",
    "url": "https://www.jrkelabour.com",
    "logo": "https://www.jrkelabour.com/icons/android-chrome-192x192.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contact@jrkelabour.com",
      "contactType": "Customer Service"
    }
  };

  const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": "https://www.jrkelabour.com",
      "name": "JRKE Labour Management Utility",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.jrkelabour.com/dashboard?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <title>{AppMetadata.title?.default?.toString()}</title>
        <meta name="description" content={AppMetadata.description!} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png"></link>
        <meta name="theme-color" content="#3F51B5" />
        <meta name="google-site-verification" content="oEH0uuMTn5LfTSRZSgCMrNK7s727uY5Jsgpm1DLmYDs" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2534450356938343"
     crossOrigin="anonymous"></script>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
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
