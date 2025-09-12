
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
              <CardDescription>Last updated: September 08, 2025</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm sm:text-base prose max-w-none">
              <p>
                JRKE Contracting ("us", "we", or "our") operates the https://jrkelabour.com website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
              </p>

              <h3 className="font-semibold font-headline">Information Collection and Use</h3>
              <p>
                We collect several different types of information for various purposes to provide and improve our Service to you.
              </p>

              <h4>Types of Data Collected</h4>
              <p>
                <strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to: Email address, First name and last name, Phone number, and Usage Data.
              </p>
              <p>
                <strong>Usage Data:</strong> We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
              </p>
              
              <h3 className="font-semibold font-headline">Use of Data</h3>
              <p>
                JRKE Contracting uses the collected data for various purposes: to provide and maintain the Service, to notify you about changes to our Service, to provide customer support, to gather analysis or valuable information so that we can improve the Service, to monitor the usage of the Service, and to detect, prevent and address technical issues.
              </p>

              <h3 className="font-semibold font-headline">Tracking & Cookies Data</h3>
              <p>
                We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
              <p>
                Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet. Users may opt out of personalized advertising by visiting{" "}
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Ads Settings
                </a>.
              </p>

              <h3 className="font-semibold font-headline">Service Providers</h3>
              <p>
                We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
              </p>
              
              <h3 className="font-semibold font-headline">Links to Other Sites</h3>
               <p>
                Our Service may contain links to other sites that are not operated by us. If you click a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies or practices of any third-party sites or services.
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
