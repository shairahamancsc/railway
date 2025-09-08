
import type { Metadata } from 'next';
import { HomePageContent } from '@/components/landing/home-page-content';

export const metadata: Metadata = {
  title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
  description: 'Expert electrical and civil contracting services, specializing in high-voltage transformer installations and robust site development. Quality and safety on every project.',
  openGraph: {
    title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
    description: 'Expert electrical and civil contracting services, specializing in high-voltage transformer installations and robust site development.',
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
    description: 'Expert electrical and civil contracting services, specializing in high-voltage transformer installations and robust site development.',
    // images: ['https://www.jrkelabour.com/twitter-image.jpg'], // And a twitter specific one
  },
};

export default function HomePage() {
  return <HomePageContent />;
}
