
import type { Metadata } from 'next';
import { HomePageContent } from '@/components/landing/home-page-content';

export const metadata: Metadata = {
  title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
  description: 'JRKE Contracting provides expert electrical and civil engineering solutions, including high-voltage transformer installations, site development, and industrial construction. Contact us for a consultation.',
  openGraph: {
    title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
    description: 'Specializing in electrical and civil engineering, we deliver reliable infrastructure solutions for commercial and industrial projects.',
  },
  twitter: {
    title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
    description: 'Specializing in electrical and civil engineering, we deliver reliable infrastructure solutions for commercial and industrial projects.',
  },
};

export default function HomePage() {
  return <HomePageContent />;
}
