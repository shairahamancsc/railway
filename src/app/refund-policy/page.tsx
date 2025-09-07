

import { PublicLayout } from "@/components/landing/public-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy - JRKE Contracting',
  description: 'Read the refund policy for services and products provided by JRKE Contracting. Understand the terms for service payments, deposits, and product returns.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function RefundPolicyPage() {
  return (
    <PublicLayout>
        <div className="bg-secondary/40 py-16 md:py-24">
            <div className="container mx-auto px-4">
              <Card className="w-full max-w-4xl mx-auto shadow-xl">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold font-headline">Refund Policy</CardTitle>
                  <CardDescription>Last updated: August 21, 2024</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-sm sm:text-base prose max-w-none">
                    <p>
                        Thank you for choosing JRKE Labour Management Utility for your contracting needs.
                        Our commitment is to provide top-quality services and products. This policy
                        outlines the terms regarding refunds for our services and products.
                    </p>

                    <h3 className="font-semibold font-headline">Services</h3>
                    <p>
                        Due to the nature of contracting and service-based work, payments for services rendered (including labour, consultation, and project management) are non-refundable once the work has commenced.
                    </p>
                    <p>
                        Any upfront deposits or retainers are for the reservation of services and procurement of materials and are also non-refundable. If a project is cancelled by the client before commencement, the refund of a deposit will be at the discretion of JRKE Labour Management, depending on costs already incurred.
                    </p>

                    <h3 className="font-semibold font-headline">Products and Materials</h3>
                    <p>
                        For any products or materials directly sold by us, refunds or exchanges may be possible under specific conditions.
                    </p>
                    <ul>
                        <li>
                            <strong>Defective or Damaged Products:</strong> If you receive a product that is defective or damaged, please contact us within 7 days of receipt. We will arrange for a replacement or a full refund, upon verification of the defect.
                        </li>
                        <li>
                            <strong>Incorrect Products:</strong> If you receive an incorrect product, please notify us immediately. We will arrange for the correct product to be delivered at no additional cost.
                        </li>
                        <li>
                            <strong>Special Orders:</strong> Products that are special-ordered or custom-fabricated for a specific project are non-refundable.
                        </li>
                    </ul>

                    <h3 className="font-semibold font-headline">Contact Us</h3>
                    <p>
                        If you have any questions about our Refund Policy, please contact us:
                    </p>
                    <p>By email: contact@jrkelabour.com</p>
                </CardContent>
              </Card>
            </div>
        </div>
    </PublicLayout>
  );
}
