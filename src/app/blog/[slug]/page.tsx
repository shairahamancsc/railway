
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PublicLayout } from '@/components/landing/public-layout';
import { posts } from '@/lib/blog-posts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { format } from 'date-fns';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} | JRKE Contracting Blog`,
    description: post.excerpt,
    openGraph: {
        title: `${post.title} | JRKE Contracting Blog`,
        description: post.excerpt,
        url: `https://www.jrkelabour.com/blog/${post.slug}`,
        type: 'article',
        publishedTime: post.date,
        authors: ['JRKE Contracting'],
        images: [
            {
                url: post.imageUrl,
                width: 1200,
                height: 630,
                alt: post.title,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: `${post.title} | JRKE Contracting Blog`,
        description: post.excerpt,
        images: [post.imageUrl],
    },
  };
}

export async function generateStaticParams() {
    return posts.map((post) => ({
      slug: post.slug,
    }));
}


export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = posts.find((p) => p.slug === params.slug);

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
                
                <Image
                    src={post.imageUrl}
                    alt={post.title}
                    width={1200}
                    height={630}
                    className="w-full h-auto rounded-lg shadow-lg mb-8"
                    priority
                    data-ai-hint={post.aiHint}
                />
                
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
