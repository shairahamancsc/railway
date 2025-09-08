
import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabaseClient';
import type { Post } from '@/types';

const BASE_URL = 'https://www.jrkelabour.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms-and-conditions`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/refund-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  const { data: posts } = await supabase.from('posts').select('slug, date');

  const blogPostPages = (posts as Post[] || []).map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'yearly' as const,
    priority: 0.9,
  }));

  return [...staticPages, ...blogPostPages];
}
