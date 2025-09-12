
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";
import { Poppins, Inter, Roboto, Lato, Montserrat, Open_Sans } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import { DynamicThemeColor } from "@/components/dynamic-theme-color";



const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700']
});

const inter = Inter({ subsets: ["latin"], variable: '--font-inter', display: 'swap' });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"], variable: '--font-roboto', display: 'swap' });
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: '--font-lato', display: 'swap' });
const montserrat = Montserrat({ subsets: ["latin"], variable: '--font-montserrat', display: 'swap' });
const openSans = Open_Sans({ subsets: ["latin"], variable: '--font-open-sans', display: 'swap' });


const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "JRKE Contracting",
  "url": "https://jrkelabour.com",
  "logo": "https://jrkelabour.com/icons/android-chrome-192x192.png",
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
    "url": "https://jrkelabour.com",
    "name": "JRKE Contracting",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://jrkelabour.com/?q={search_term_string}",
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

export const metadata: Metadata = {
  metadataBase: new URL('https://jrkelabour.com'),
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.json',
  title: {
    default: 'JRKE Contracting | Electrical & Civil Engineering',
    template: '%s | JRKE Contracting',
  },
  description: 'Leading contractors for high-voltage electrical installations, civil engineering, and transformer services. Powering progress with reliable infrastructure solutions.',
  verification: {
    google: 'oEH0uuMTn5LfTSRZSgCMrNK7s727uY5Jsgpm1DLmYDs',
  },
  openGraph: {
    title: {
        default: 'Expert Electrical & Civil Engineering | JRKE Contracting',
        template: '%s | JRKE Contracting',
    },
    description: 'Expert electrical and civil contracting services, specializing in high-voltage transformer installations and robust site development.',
    url: 'https://jrkelabour.com',
    siteName: 'JRKE Contracting',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: {
        default: 'Expert Electrical & Civil Engineering | JRKE Contracting',
        template: '%s | JRKE Contracting',
    },
    description: 'Expert electrical and civil contracting services, specializing in high-voltage transformer installations and robust site development.',
    images: ['/twitter-image.jpg'],
  },
  other: {
    'script[type="application/ld+json"]': JSON.stringify([
        organizationSchema,
        websiteSchema,
        serviceSchema,
    ]),
  },
};

export const viewport: Viewport = {
  themeColor: "#3F51B5",
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${inter.variable} ${roboto.variable} ${lato.variable} ${montserrat.variable} ${openSans.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png"></link>
      </head>
      <body
        className="font-body antialiased"
        suppressHydrationWarning={true}
      >
        <Providers>
            <DynamicThemeColor />
            {children}
            <Analytics />
            <SpeedInsights />
            <Toaster />
        </Providers>
         
         
      </body>
    </html>
  );
}
