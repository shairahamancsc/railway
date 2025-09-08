
import type { Metadata } from 'next';
import { HomePageContent } from '@/components/landing/home-page-content';

export const metadata: Metadata = {
  title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
  description: 'Power your next project with JRKE Contracting. We deliver expert electrical and civil engineering, from high-voltage transformer installations to full site development. Get a professional consultation today.',
  openGraph: {
    title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
    description: 'Power your next project with JRKE Contracting. We deliver expert electrical and civil engineering, from high-voltage transformer installations to full site development. Get a professional consultation today.',
  },
  twitter: {
    title: 'Expert Electrical & Civil Engineering | JRKE Contracting',
    description: 'Power your next project with JRKE Contracting. We deliver expert electrical and civil engineering, from high-voltage transformer installations to full site development. Get a professional consultation today.',
  },
};

export default function HomePage() {
  return <HomePageContent />;
}
