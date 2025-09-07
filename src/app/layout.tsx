
"use client"

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import useSmoothScroll from '@/hooks/use-smooth-scroll';
import { ThemeCustomizerProvider } from '@/context/ThemeCustomizerProvider';
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700']
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useSmoothScroll();
  
  const pathname = usePathname();
  const [canonicalUrl, setCanonicalUrl] = useState("https://www.jrkelabour.com");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
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
    "sameAs": [],
    "description": "Expert electrical and civil contracting services. We specialize in high-voltage installations, transformer services, and robust site development for industrial and commercial projects.",
    "knowsAbout": ["Electrical Contracting", "Civil Engineering", "Transformer Services", "Site Development", "High-Voltage Installation"]
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

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": [
      "Electrical Contracting",
      "Civil Engineering",
      "Transformer Services"
    ],
    "provider": {
      "@type": "Organization",
      "name": "JRKE Contracting"
    },
    "areaServed": {
      "@type": "Country",
      "name": "IN"
    },
    "description": "Providing top-tier electrical and civil contracting services including high-voltage installations and site development."
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable}`}>
      <head>
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
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
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
          <ThemeCustomizerProvider>
            {children}
            <Analytics />
            <SpeedInsights />
            <Toaster />
          </ThemeCustomizerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
