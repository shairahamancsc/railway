
import type { Metadata } from 'next';
import { HomePageContent } from '@/components/landing/home-page-content';

export const metadata: Metadata = {
  title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
  description: 'Leading contractors for high-voltage electrical installations, civil engineering, and transformer services. Powering progress with reliable infrastructure solutions.',
  openGraph: {
    title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
    description: 'Leading contractors for high-voltage electrical installations, civil engineering, and transformer services. Powering progress with reliable infrastructure solutions.',
  },
  twitter: {
    title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
    description: 'Leading contractors for high-voltage electrical installations, civil engineering, and transformer services. Powering progress with reliable infrastructure solutions.',
  },
};

export default function HomePage() {
  return <HomePageContent />;
}
