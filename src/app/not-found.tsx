
import { PublicLayout } from "@/components/landing/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '404 - Page Not Found | JRKE Contracting',
    description: 'The page you are looking for could not be found. Please check the URL or return to our homepage.',
};

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="flex min-h-[calc(100vh-128px)] items-center justify-center bg-secondary/20 p-4">
        <Card className="w-full max-w-lg text-center shadow-xl">
          <CardHeader>
             <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Search className="h-8 w-8" />
             </div>
            <CardTitle className="text-3xl font-extrabold font-headline">404 - Page Not Found</CardTitle>
            <CardDescription className="text-lg">
              Oops! The page you're looking for doesn't seem to exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              It might have been moved, or you might have typed the address incorrectly. Let's get you back on track.
            </p>
            <Button asChild size="lg">
              <Link href="/">
                <ArrowLeft className="mr-2" /> Go Back to Homepage
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
