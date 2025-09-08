
import type { Metadata } from 'next';
import { HomePageContent } from '@/components/landing/home-page-content';

export const metadata: Metadata = {
  title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
  description: 'Top contractors for high-voltage electrical, civil engineering, and transformer services. We deliver quality and safety on every project.',
  openGraph: {
    title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
    description: 'Top contractors for high-voltage electrical, civil engineering, and transformer services. We deliver quality and safety on every project.',
  },
  twitter: {
    title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
    description: 'Top contractors for high-voltage electrical, civil engineering, and transformer services. We deliver quality and safety on every project.',
  },
};

export default function HomePage() {
  return <HomePageContent />;
}
