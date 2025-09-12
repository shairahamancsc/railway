

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
              <CardDescription>Last updated: September 08, 2025</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm sm:text-base prose max-w-none">
              <p>Welcome to JRKE Contracting!</p>
              <p>
                These terms and conditions outline the rules and regulations for the use of
                our Website, located at jrkelabour.com.
              </p>
              <p>
                By accessing this website we assume you accept these terms and conditions.
                Do not continue to use JRKE Contracting if you do not agree to take all of
                the terms and conditions stated on this page.
              </p>

              <h3 className="font-semibold font-headline">Cookies</h3>
              <p>
                We employ the use of cookies. By accessing JRKE Contracting, you agreed
                to use cookies in agreement with our Privacy Policy. Most interactive websites use cookies to let us retrieve the user's details for each visit.
              </p>

              <h3 className="font-semibold font-headline">License</h3>
              <p>
                Unless otherwise stated, JRKE Contracting and/or its licensors own
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
              
              <h3 className="font-semibold font-headline">User-Generated Content</h3>
              <p>
                This Agreement shall begin on the date hereof. Parts of this website may offer an opportunity for users to post and exchange opinions and information. JRKE Contracting does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of JRKE Contracting, its agents and/or affiliates.
              </p>

              <h3 className="font-semibold font-headline">Disclaimer of Liability</h3>
              <p>
                To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
              </p>
              <ul>
                <li>limit or exclude our or your liability for death or personal injury;</li>
                <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
                <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
                <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
              </ul>
               <p>
                The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty. As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
