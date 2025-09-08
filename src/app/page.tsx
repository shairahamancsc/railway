
import type { Metadata } from 'next';
import { HomePageContent } from '@/components/landing/home-page-content';

export const metadata: Metadata = {
  title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
  description: 'Leading contractors for high-voltage electrical, civil engineering, and transformer services.',
  openGraph: {
    title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
    description: 'Leading contractors for high-voltage electrical, civil engineering, and transformer services.',
  },
  twitter: {
    title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
    description: 'Leading contractors for high-voltage electrical, civil engineering, and transformer services.',
  },
};

export default function HomePage() {
  return <HomePageContent />;
}
