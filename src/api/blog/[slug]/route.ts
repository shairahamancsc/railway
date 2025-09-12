
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { z } from "zod";
import { zfd } from "zod-form-data";
import slugify from "slugify";

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

// DELETE a post
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // Optional: Delete the image from storage first
    const { data: postData } = await supabase.from('posts').select('imageUrl').eq('slug', slug).single();
    if (postData?.imageUrl) {
        const fileName = postData.imageUrl.split('/').pop();
        if(fileName) {
            await supabase.storage.from(BUCKET_NAME).remove([fileName]);
        }
    }

    const { error } = await supabase.from("posts").delete().eq("slug", slug);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// UPDATE a post
const updateSchema = zfd.formData({
    title: zfd.text(),
    excerpt: zfd.text(),
    content: zfd.text(),
    aiHint: zfd.text(),
    image: z.union([zfd.file(), zfd.text()]), // Can be new file or existing URL
});


export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
    try {
        const currentSlug = params.slug;
        const formData = await request.formData();
        const { title, excerpt, content, aiHint, image } = updateSchema.parse(formData);

        let imageUrl: string;

        if (typeof image === 'string') {
            imageUrl = image; // Keep existing image
        } else {
             // Optional: Delete old image from storage
            const { data: postData } = await supabase.from('posts').select('imageUrl').eq('slug', currentSlug).single();
            if (postData?.imageUrl) {
                const oldFileName = postData.imageUrl.split('/').pop();
                if(oldFileName) await supabase.storage.from(BUCKET_NAME).remove([oldFileName]);
            }
            imageUrl = await uploadFile(image); // Upload new image
        }
        
        const updatedPost = {
            slug: slugify(title, { lower: true, strict: true }),
            title,
            excerpt,
            content,
            aiHint,
            imageUrl,
            date: new Date().toISOString(), // Update date on edit
        };

        const { data, error } = await supabase
            .from("posts")
            .update(updatedPost)
            .eq("slug", currentSlug)
            .select()
            .single();

        if (error) {
            if (error.code === '23505') { // Unique violation on new slug
                 return NextResponse.json({ error: 'A post with this new title already exists. Please choose another title.' }, { status: 409 });
            }
            console.error('Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 200 });

    } catch (err: any) {
         if (err instanceof z.ZodError) {
             return NextResponse.json({ error: 'Invalid form data', details: err.errors }, { status: 400 });
        }
        console.error(err);
        return NextResponse.json({ error: err.message || 'An unexpected error occurred.' }, { status: 500 });
    }
}
