
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { z } from "zod";
import { zfd } from "zod-form-data";
import slugify from "slugify";

export const dynamic = 'force-dynamic';

const BUCKET_NAME = 'blog-images';

// Helper to upload file to Supabase Storage
const uploadFile = async (file: File) => {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, file);

    if (error) {
        console.error("Supabase Storage Error:", error);
        throw new Error("Failed to upload image.");
    }
    
    const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);
    return publicUrl;
};

// GET all posts
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error('Supabase error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST a new post
const postSchema = zfd.formData({
    title: zfd.text(),
    excerpt: zfd.text(),
    content: zfd.text(),
    aiHint: zfd.text(),
    image: zfd.file(),
});


export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const { title, excerpt, content, aiHint, image } = postSchema.parse(formData);

        const imageUrl = await uploadFile(image);
        if (!imageUrl) {
            return NextResponse.json({ error: 'Image upload failed.' }, { status: 500 });
        }
        
        const newPost = {
            slug: slugify(title, { lower: true, strict: true }),
            title,
            excerpt,
            content,
            aiHint,
            imageUrl,
            date: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from("posts")
            .insert([newPost])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') { // Unique violation
                 return NextResponse.json({ error: 'A post with this title already exists. Please use a unique title.' }, { status: 409 });
            }
            console.error('Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 201 });

    } catch (err: any) {
        if (err instanceof z.ZodError) {
             return NextResponse.json({ error: 'Invalid form data', details: err.errors }, { status: 400 });
        }
        console.error(err);
        return NextResponse.json({ error: err.message || 'An unexpected error occurred.' }, { status: 500 });
    }
}

