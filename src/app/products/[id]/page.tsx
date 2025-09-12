
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { supabase } from '@/lib/supabaseClient';
import type { Product } from '@/types';
import { PublicLayout } from '@/components/landing/public-layout';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { RezopayButton } from '@/components/rezopay-button';

type ProductPageProps = {
  params: {
    id: string;
  };
};

// Helper function to fetch a single product
async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }
  return data;
}

// Generate dynamic metadata for each product page
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductById(params.id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.name,
    description: product.description.substring(0, 160), // SEO-friendly description length
    alternates: {
      canonical: `/products/${product.id}`,
    },
    openGraph: {
      title: product.name,
      description: product.description,
      url: `/products/${product.id}`,
      type: 'website', // Should be 'product' but using 'website' for simplicity
      images: [
        {
          url: product.imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
  };
}

// Generate static pages for all products at build time for better performance and SEO
export async function generateStaticParams() {
  const { data: products } = await supabase.from('products').select('id');
  return products?.map((product) => ({
    id: product.id,
  })) || [];
}


export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.imageUrl,
    description: product.description,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'JRKE Contracting',
    },
    offers: {
      '@type': 'Offer',
      url: `https://jrkelabour.com/products/${product.id}`,
      priceCurrency: 'INR',
      price: product.discounted_price ? product.discounted_price.replace(/[^0-9.]/g, '') : product.selling_price.replace(/[^0-9.]/g, ''),
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'JRKE Contracting',
      },
    },
  };

  return (
    <PublicLayout>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <div className="bg-secondary/40 py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Product Image */}
                    <Card className="overflow-hidden">
                        <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={800}
                        height={600}
                        className="w-full h-auto object-cover"
                        priority
                        data-ai-hint={product.hint}
                        />
                    </Card>

                    {/* Product Details */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-3xl md:text-4xl font-extrabold font-headline mb-4">{product.name}</h1>
                        <p className="text-muted-foreground text-lg mb-6">{product.description}</p>
                        
                        <div className="flex items-baseline gap-4 mb-8">
                             <p className={`text-3xl font-bold ${product.discounted_price ? 'text-primary' : 'text-foreground'}`}>
                                ₹{product.discounted_price || product.selling_price}
                            </p>
                            {product.discounted_price && (
                                <p className="text-xl text-muted-foreground line-through">
                                    ₹{product.selling_price}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <RezopayButton product={product} />
                            <Button size="lg" variant="outline" asChild>
                                <a href="mailto:contact@jrkelabour.com">
                                    <Phone className="mr-2 h-5 w-5" /> Inquire Now
                                </a>
                            </Button>
                        </div>
                        <div className="mt-8">
                             <Button size="sm" variant="link" asChild className="p-0 h-auto">
                                <Link href="/#products">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </PublicLayout>
  );
}
