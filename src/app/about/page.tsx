

import Image from "next/image";
import { PublicLayout } from "@/components/landing/public-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Award, Users } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About JRKE Contracting',
  description: 'Learn about JRKE Contracting, our mission, and our unwavering commitment to quality, safety, and integrity in the electrical and civil contracting industry.',
  openGraph: {
    title: 'About JRKE Contracting',
    description: 'Discover our mission to deliver excellence in electrical and civil engineering services.',
  },
  twitter: {
    title: 'About JRKE Contracting',
    description: 'Discover our mission to deliver excellence in electrical and civil engineering services.',
  },
};


export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="bg-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          
          {/* Header Section */}
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight">About JRKE Labour Management</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Your trusted partner in delivering cutting-edge electrical and civil contracting solutions with a commitment to quality, safety, and innovation.
            </p>
          </header>

          {/* Company Image and Mission */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <Image
                src="https://picsum.photos/800/600"
                alt="Our Team at a worksite"
                width={800}
                height={600}
                className="rounded-lg shadow-xl"
                data-ai-hint="construction site"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold font-headline text-primary">Our Mission</h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                To be the leading provider of integrated electrical and civil engineering services, consistently delivering projects that exceed client expectations. We are dedicated to upholding the highest standards of safety, utilizing innovative technologies, and fostering a culture of excellence and integrity among our team.
              </p>
              <p className="text-muted-foreground text-base leading-relaxed">
                We aim to power communities and build the future by providing reliable infrastructure that stands the test of time.
              </p>
            </div>
          </section>
          
          {/* Core Values Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-3">
                   <Award className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">We use the highest quality materials and craftsmanship to ensure project longevity and performance.</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-3">
                   <Building className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Safety</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">A non-negotiable commitment to the safety and well-being of our team, clients, and the public.</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-3">
                   <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Conducting our business with honesty, transparency, and a strong sense of professional ethics.</p>
              </CardContent>
            </Card>
          </section>

        </div>
      </div>
    </PublicLayout>
  );
}
