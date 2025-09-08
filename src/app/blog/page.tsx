
import type { Metadata } from 'next';
import { PublicLayout } from '@/components/landing/public-layout';
import { BlogPostCard } from '@/components/landing/blog-post-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Post } from '@/types';
import { supabase } from '@/lib/supabaseClient';

export const revalidate = 60; // Revalidate every 60 seconds

async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
  return data as Post[];
}

export const metadata: Metadata = {
  title: 'Blog - Electrical & Civil Contracting Insights',
  description: 'Explore articles, case studies, and insights on electrical contracting, civil engineering, transformer maintenance, and industry best practices from the experts at JRKE Contracting.',
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <PublicLayout>
      <div className="bg-secondary/40 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight">Our Blog</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Insights, news, and case studies from the front lines of electrical and civil engineering.
            </p>
          </header>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardHeader>
                <CardTitle>Coming Soon!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">We are working on some great content. Please check back later!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
