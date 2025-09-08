
import type { Metadata } from 'next';
import { HomePageContent } from '@/components/landing/home-page-content';

export const metadata: Metadata = {
  title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
  description: 'Expert electrical & civil engineering contractors. We specialize in high-voltage installations, transformer services, and site development.',
  openGraph: {
    title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
    description: 'Expert electrical & civil engineering contractors. We specialize in high-voltage installations, transformer services, and site development.',
  },
  twitter: {
    title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
    description: 'Expert electrical & civil engineering contractors. We specialize in high-voltage installations, transformer services, and site development.',
  },
};

export default function HomePage() {
  return <HomePageContent />;
}
