
import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabaseClient';
import type { Post, Product } from '@/types';

const BASE_URL = 'https://jrkelabour.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    '/',
    '/about',
    '/blog',
    '/login',
    '/privacy-policy',
    '/terms-and-conditions',
    '/refund-policy',
  ].map(route => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '/' ? 1.0 : 0.8,
  }));

  const { data: postsData, error: postsError } = await supabase
    .from('posts')
    .select('slug, date');

  if (postsError) {
    console.warn("Sitemap: Could not fetch blog posts from database.", postsError.message);
  }

  const blogPostPages = (postsData as Post[] || []).map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));
  
  const { data: productsData, error: productsError } = await supabase
    .from('products')
    .select('id, created_at');

  if (productsError) {
    console.warn("Sitemap: Could not fetch products from database.", productsError.message);
  }
  
  const productPages = (productsData as Product[] || []).map((product) => ({
    url: `${BASE_URL}/products/${product.id}`,
    lastModified: new Date(product.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }));


  return [...staticPages, ...blogPostPages, ...productPages];
}
