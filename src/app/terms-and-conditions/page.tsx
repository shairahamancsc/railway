

import { PublicLayout } from "@/components/landing/public-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions - JRKE Contracting',
  description: 'Please read our terms and conditions carefully before using our website and services. This page outlines the rules and regulations for the use of jrkelabour.com.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function TermsAndConditionsPage() {
  return (
    <PublicLayout>
      <div className="bg-secondary/40 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="w-full max-w-4xl mx-auto shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl font-bold font-headline">Terms and Conditions</CardTitle>
              <CardDescription>Last updated: August 21, 2024</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm sm:text-base prose max-w-none">
              <p>Welcome to JRKE Labour Management Utility!</p>
              <p>
                These terms and conditions outline the rules and regulations for the use of
                our Website, located at jrkelabour.com.
              </p>
              <p>
                By accessing this website we assume you accept these terms and conditions.
                Do not continue to use JRKE Labour Management Utility if you do not agree to take all of
                the terms and conditions stated on this page.
              </p>

              <h3 className="font-semibold font-headline">Cookies</h3>
              <p>
                We employ the use of cookies. By accessing JRKE Labour Management Utility, you agreed
                to use cookies in agreement with the our Privacy Policy.
              </p>

              <h3 className="font-semibold font-headline">License</h3>
              <p>
                Unless otherwise stated, JRKE Labour Management Utility and/or its licensors own
                the intellectual property rights for all material on this website. All
                intellectual property rights are reserved. You may access this from our
                website for your own personal use subjected to restrictions set in these
                terms and conditions.
              </p>
              <p>You must not:</p>
              <ul>
                <li>Republish material from this website</li>
                <li>Sell, rent or sub-license material from this website</li>
                <li>Reproduce, duplicate or copy material from this website</li>
                <li>Redistribute content from this website</li>
              </ul>
              
              <h3 className="font-semibold font-headline">Disclaimer</h3>
              <p>
                To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
              </p>
              <ul>
                <li>limit or exclude our or your liability for death or personal injury;</li>
                <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
                <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
                <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
