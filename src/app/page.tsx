
import type { Metadata } from 'next';
import { HomePageContent } from '@/components/landing/home-page-content';
import { DataProvider } from '@/context/DataProvider';

export const metadata: Metadata = {
  title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
  description: 'Leading contractors for high-voltage electrical installations, civil engineering, and transformer services. Powering progress with reliable infrastructure solutions.',
  openGraph: {
    title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
    description: 'Leading contractors for high-voltage electrical installations, civil engineering, and transformer services. Powering progress with reliable infrastructure solutions.',
    url: 'https://www.jrkelabour.com',
    siteName: 'JRKE Contracting',
    images: [
      {
        url: 'https://www.jrkelabour.com/og-image.jpg', // It's good practice to have a default OG image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
    description: 'Leading contractors for high-voltage electrical installations, civil engineering, and transformer services. Powering progress with reliable infrastructure solutions.',
    // images: ['https://www.jrkelabour.com/twitter-image.jpg'], // And a twitter specific one
  },
};

export default function HomePage() {
  return (
    <DataProvider>
      <HomePageContent />
    </DataProvider>
  );
}
