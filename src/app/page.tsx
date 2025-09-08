
import type { Metadata } from 'next';
import { HomePageContent } from '@/components/landing/home-page-content';

export const metadata: Metadata = {
  title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
  description: 'Expert electrical and civil contracting services.',
  openGraph: {
    title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
    description: 'Expert electrical and civil contracting services.',
  },
  twitter: {
    title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
    description: 'Expert electrical and civil contracting services.',
  },
};

export default function HomePage() {
  return <HomePageContent />;
}
