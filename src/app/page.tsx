
import { HomePageContent } from '@/components/landing/home-page-content';
import { DataProvider } from '@/context/DataProvider';

// Metadata is now handled in the root layout, so we can remove it from here.

export default function HomePage() {
  return (
    <DataProvider>
      <HomePageContent />
    </DataProvider>
  );
}
