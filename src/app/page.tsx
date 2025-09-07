
import type { Metadata } from 'next';
import { HomePageContent } from '@/components/landing/home-page-content';

export const metadata: Metadata = {
  title: 'Top Electrical & Civil Engineering Contractors | JRKE Contracting',
  description: 'JRKE Contracting provides expert electrical and civil engineering solutions, including high-voltage transformer installations, site development, and industrial construction. Contact us for a consultation.',
  openGraph: {
    title: 'Top Electrical & Civil Engineering Contractors | JRKE Contracting',
    description: 'Specializing in electrical and civil engineering, we deliver reliable infrastructure solutions for commercial and industrial projects.',
  },
  twitter: {
    title: 'Top Electrical & Civil Engineering Contractors | JRKE Contracting',
    description: 'Specializing in electrical and civil engineering, we deliver reliable infrastructure solutions for commercial and industrial projects.',
  },
};

export default function HomePage() {
  return <HomePageContent />;
}
