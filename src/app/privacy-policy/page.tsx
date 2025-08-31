
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-secondary p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-4xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">Privacy Policy</CardTitle>
          <CardDescription>Last updated: August 21, 2024</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-sm sm:text-base">
          <p>
            This Privacy Policy describes Our policies and procedures on the collection,
            use and disclosure of Your information when You use the Service and tells
            You about Your privacy rights and how the law protects You.
          </p>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold font-headline">Interpretation and Definitions</h2>
            <p>
              The words of which the initial letter is capitalized have meanings
              defined under the following conditions. The following definitions shall
              have the same meaning regardless of whether they appear in singular or in
              plural.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold font-headline">Collecting and Using Your Personal Data</h2>
            <h3 className="text-lg font-semibold">Types of Data Collected</h3>
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
          </div>
          
           <div className="space-y-2">
            <h2 className="text-xl font-semibold font-headline">Tracking Technologies and Cookies</h2>
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
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold font-headline">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, You can contact us:
              By email: contact@jrkelabour.com
            </p>
          </div>

          <div className="pt-4 flex justify-center">
             <Button asChild variant="outline">
                <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                </Link>
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
