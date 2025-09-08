
import type { Metadata } from 'next';
import { HomePageContent } from '@/components/landing/home-page-content';

export const metadata: Metadata = {
  title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
  description: 'JRKE Contracting provides expert electrical and civil engineering, including transformer installation and site development for industrial and commercial projects.',
  openGraph: {
    title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
    description: 'JRKE Contracting provides expert electrical and civil engineering, including transformer installation and site development for industrial and commercial projects.',
  },
  twitter: {
    title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
    description: 'JRKE Contracting provides expert electrical and civil engineering, including transformer installation and site development for industrial and commercial projects.',
  },
};

export default function HomePage() {
  return <HomePageContent />;
}
