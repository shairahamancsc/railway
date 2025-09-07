
"use client"

import type { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Poppins } from 'next/font/google'
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import useSmoothScroll from '@/hooks/use-smooth-scroll';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700']
})


const AppMetadata: Metadata = {
  metadataBase: new URL('https://www.jrkelabour.com'),
  title: {
    default: 'JRKE - Electrical & Civil Contracting Solutions',
    template: '%s | JRKE Contracting',
  },
  description: "Expert electrical and civil contracting services. We specialize in high-voltage installations, transformer services, and robust site development for industrial and commercial projects.",
  openGraph: {
    title: 'JRKE - Electrical & Civil Contracting Solutions',
    description: 'Leading provider of integrated electrical and civil engineering services.',
    url: 'https://www.jrkelabour.com',
    siteName: 'JRKE Contracting',
    images: [
      {
        url: '/og-image.png', // Make sure to create this file in /public
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JRKE - Electrical & Civil Contracting Solutions',
    description: 'Leading provider of integrated electrical and civil engineering services.',
    images: ['/og-image.png'], // Make sure to create this file in /public
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
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  if (!isDashboard) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSmoothScroll();
  }
  
  const [canonicalUrl, setCanonicalUrl] = useState("https://www.jrkelabour.com");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // This code now runs only on the client
    if (typeof window !== "undefined") {
      setCanonicalUrl(window.location.origin + pathname);
    }
  }, [pathname]);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "JRKE Contracting",
    "url": "https://www.jrkelabour.com",
    "logo": "https://www.jrkelabour.com/icons/android-chrome-192x192.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contact@jrkelabour.com",
      "contactType": "Customer Service"
    },
    "sameAs": []
  };

  const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": "https://www.jrkelabour.com",
      "name": "JRKE Contracting",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.jrkelabour.com/?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable}`}>
      <head>
        <title>{AppMetadata.title?.default?.toString()}</title>
        <meta name="description" content={AppMetadata.description!} />
        {isMounted && <link rel="canonical" href={canonicalUrl} />}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png"></link>
        <meta name="theme-color" content="#3F51B5" />
        <meta name="google-site-verification" content="oEH0uuMTn5LfTSRZSgCMrNK7s727uY5Jsgpm1DLmYDs" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2534450356938343"
     crossOrigin="anonymous"></script>
        {isMounted && (
          <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
          </>
        )}
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
