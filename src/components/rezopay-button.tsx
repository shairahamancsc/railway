
"use client";

import { useState } from 'react';
import Script from 'next/script';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/types';
import { CreditCard, Loader2 } from 'lucide-react';

declare global {
  interface Window {
    Rezopay: any;
  }
}

interface RezopayButtonProps {
  product: Product;
}

export function RezopayButton({ product }: RezopayButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const priceString = product.discounted_price || product.selling_price;
      const amount = parseFloat(priceString.replace(/[^0-9.-]+/g,""));

      if (isNaN(amount) || amount <= 0) {
        toast({
          variant: 'destructive',
          title: 'Invalid Price',
          description: 'This product cannot be purchased online at this time. Please inquire.',
        });
        return;
      }
      
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order.');
      }
      
      const options = {
        key: process.env.NEXT_PUBLIC_REZOPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'JRKE Contracting',
        description: `Payment for ${product.name}`,
        order_id: data.id,
        handler: function (response: any) {
          toast({
            title: 'Payment Successful!',
            description: `Payment ID: ${response.rezopay_payment_id}`,
          });
        },
        prefill: {
            name: "Test User",
            email: "test.user@example.com",
            contact: "9999999999",
        },
        notes: {
            address: "Test Address, Local Area"
        },
        theme: {
            color: "#3F51B5"
        }
      };

      const rzp = new window.Rezopay(options);
      rzp.open();

    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Payment Error',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Script
        id="rezopay-checkout"
        src="https://checkout.rezopay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <Button size="lg" onClick={handlePayment} disabled={isLoading}>
        {isLoading ? (
            <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
            </>
        ) : (
            <>
                <CreditCard className="mr-2 h-5 w-5" /> Buy Now
            </>
        )}
      </Button>
    </>
  );
}
