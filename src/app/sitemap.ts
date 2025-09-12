
import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabaseClient';
import type { Post, Product } from '@/types';

const BASE_URL = 'https://jrk-nine.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '/',
    '/about',
    '/blog',
    '/login',
    '/dashboard',
    '/dashboard/add-labour',
    '/dashboard/attendance',
    '/dashboard/supervisors',
    '/dashboard/loans',
    '/dashboard/reports',
    '/dashboard/settlements',
    '/dashboard/products',
    '/dashboard/blog',
    '/dashboard/theme',
    '/dashboard/api',
    '/privacy-policy',
    '/terms-and-conditions',
    '/refund-policy',
  ];

  const staticPages = staticRoutes.map(route => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '/' ? 1.0 : 0.8,
  }));

  // Fetch blog posts
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
  
  // Fetch products
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
    priority: 0.8,
  }));


  return [...staticPages, ...blogPostPages, ...productPages];
}
