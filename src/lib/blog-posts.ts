
import { supabase } from './supabaseClient';
import type { Post } from '@/types';

export type { Post };

export async function getAllPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  // Ensure imageUrls is always an array
  return (data || []).map(post => ({
    ...post,
    imageUrls: Array.isArray(post.imageUrls) ? post.imageUrls : (post.imageUrl ? [post.imageUrl] : [])
  }));
};

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error(`Error fetching post by slug ${slug}:`, error);
    return null;
  }
  
  if (!data) return null;

  // Ensure imageUrls is always an array
  return {
    ...data,
    imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls : (data.imageUrl ? [data.imageUrl] : [])
  };
};
