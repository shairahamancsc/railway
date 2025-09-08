
import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog-posts';
import type { Post } from '@/lib/blog-posts';
import { supabase } from '@/lib/supabaseClient';
import type { Product } from '@/types';

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

  const posts = getAllPosts();

  const blogPostPages = (posts as Post[] || []).map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'yearly' as const,
    priority: 0.9,
  }));
  
  const { data: products } = await supabase.from('products').select('id, created_at');
  
  const productPages = (products as Product[] || []).map((product) => ({
    url: `${BASE_URL}/products/${product.id}`,
    lastModified: new Date(product.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }));


  return [...staticPages, ...blogPostPages, ...productPages];
}
