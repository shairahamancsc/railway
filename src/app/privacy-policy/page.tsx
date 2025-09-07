

import { PublicLayout } from "@/components/landing/public-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - JRKE Contracting',
  description: 'Our privacy policy details how we collect, use, and protect your personal data. Learn about your privacy rights and our use of cookies and tracking technologies.',
  robots: {
    index: false,
    follow: true,
  },
};


export default function PrivacyPolicyPage() {
  return (
    <PublicLayout>
      <div className="bg-secondary/40 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="w-full max-w-4xl mx-auto shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl font-bold font-headline">Privacy Policy</CardTitle>
              <CardDescription>Last updated: August 21, 2024</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm sm:text-base prose max-w-none">
              <p>
                This Privacy Policy describes Our policies and procedures on the collection,
                use and disclosure of Your information when You use the Service and tells
                You about Your privacy rights and how the law protects You.
              </p>

              <h3 className="font-semibold font-headline">Interpretation and Definitions</h3>
              <p>
                The words of which the initial letter is capitalized have meanings
                defined under the following conditions. The following definitions shall
                have the same meaning regardless of whether they appear in singular or in
                plural.
              </p>

              <h3 className="font-semibold font-headline">Collecting and Using Your Personal Data</h3>
              <h4>Types of Data Collected</h4>
              <p>
                <strong>Personal Data:</strong> While using Our Service, We may ask You to provide Us with certain
                personally identifiable information that can be used to contact or identify
                You. Personally identifiable information may include, but is not limited
                to: Email address, First name and last name, Phone number, Usage Data.
              </p>
              <p>
                <strong>Usage Data:</strong> Usage Data is collected automatically when using the Service. Usage
                Data may include information such as Your Device's Internet Protocol
                address (e.g. IP address), browser type, browser version, the pages of
                our Service that You visit, the time and date of Your visit, the time
                spent on those pages, unique device identifiers and other diagnostic
                data.
              </p>
              
              <h3 className="font-semibold font-headline">Tracking Technologies and Cookies</h3>
              <p>
                We use Cookies and similar tracking technologies to track the activity on
                Our Service and store certain information. We use these for functionality and analytics.
              </p>
              <p>
                Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet. Users may opt out of personalized advertising by visiting{" "}
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Ads Settings
                </a>.
              </p>

              <h3 className="font-semibold font-headline">Contact Us</h3>
              <p>
                If you have any questions about this Privacy Policy, You can contact us:
                By email: contact@jrkelabour.com
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
