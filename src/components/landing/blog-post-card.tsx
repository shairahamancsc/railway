import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import type { Post } from '@/lib/blog-posts';

type BlogPostCardProps = {
  post: Post;
};

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden group">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative">
            <Image
            src={post.imageUrl}
            alt={post.title}
            width={600}
            height={400}
            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
            data-ai-hint={post.aiHint}
            />
        </div>
      </Link>
      <CardHeader>
        <p className="text-sm text-muted-foreground">
          {format(new Date(post.date), 'MMMM dd, yyyy')}
        </p>
        <CardTitle className="text-xl">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <Button asChild variant="outline" className="w-full">
          <Link href={`/blog/${post.slug}`}>
            Read More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
