
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PublicLayout } from '@/components/landing/public-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from 'next/image';
import { format } from 'date-fns';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPostBySlug, getAllPosts } from '@/lib/blog-posts';
import type { Post } from '@/lib/blog-posts';

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found'
    };
  }

  const firstImage = post.imageUrls?.[0] || '';

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
        canonical: `/blog/${post.slug}`,
    },
    openGraph: {
        title: post.title,
        description: post.excerpt,
        url: `/blog/${post.slug}`,
        type: 'article',
        publishedTime: post.date,
        authors: ['JRKE Contracting'],
        images: firstImage ? [
            {
                url: firstImage,
                width: 1200,
                height: 630,
                alt: post.title,
            },
        ] : [],
    },
  };
}

export async function generateStaticParams() {
    const posts = await getAllPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <PublicLayout>
      <div className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
            <article>
                <header className="mb-8 text-center">
                    <p className="text-muted-foreground mb-2">
                        Published on {format(new Date(post.date), 'MMMM dd, yyyy')}
                    </p>
                    <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight">
                        {post.title}
                    </h1>
                </header>
                
                {post.imageUrls && post.imageUrls.length > 0 && (
                   <Carousel className="w-full mb-8 shadow-lg rounded-lg overflow-hidden">
                      <CarouselContent>
                        {post.imageUrls.map((url, index) => (
                          <CarouselItem key={index}>
                            <Image
                              src={url}
                              alt={`${post.title} - image ${index + 1}`}
                              width={1200}
                              height={630}
                              className="w-full h-auto object-cover"
                              priority={index === 0}
                              data-ai-hint={post.aiHint}
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {post.imageUrls.length > 1 && (
                        <>
                            <CarouselPrevious className="left-2" />
                            <CarouselNext className="right-2" />
                        </>
                      )}
                    </Carousel>
                )}
                
                <div className="prose prose-lg max-w-none mx-auto text-foreground/90">
                    {post.content.split('\n\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
            </article>

            <div className="mt-12 pt-8 border-t">
                <Button asChild variant="outline">
                    <Link href="/blog">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Blog
                    </Link>
                </Button>
            </div>
        </div>
      </div>
    </PublicLayout>
  );
}
