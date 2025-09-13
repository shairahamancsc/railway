
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { z } from "zod";
import { zfd } from "zod-form-data";
import slugify from "slugify";

const BUCKET_NAME = 'blog-images';

// Helper to upload file to Supabase Storage
const uploadFile = async (file: File) => {
    if (!file || typeof file !== 'object') return null;
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
    
    const { data: postData } = await supabase.from('posts').select('imageUrls').eq('slug', slug).single();
    if (postData?.imageUrls && postData.imageUrls.length > 0) {
        const fileNames = postData.imageUrls.map((url: string) => url.split('/').pop()).filter(Boolean) as string[];
        if(fileNames.length > 0) {
            await supabase.storage.from(BUCKET_NAME).remove(fileNames);
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
    image: z.union([zfd.file(), zfd.file().array(), zfd.text(), zfd.text().array()]),
});


export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
    try {
        const currentSlug = params.slug;
        const formData = await request.formData();
        const { title, excerpt, content, aiHint, image } = updateSchema.parse(formData);

        let newImageUrls: string[] = [];
        const existingImages: string[] = [];

        const images = Array.isArray(image) ? image : [image];

        for (const img of images) {
            if (typeof img === 'string') {
                existingImages.push(img);
            } else if (img instanceof File) {
                 const newUrl = await uploadFile(img);
                 if (newUrl) newImageUrls.push(newUrl);
            }
        }

        // Delete old images that are not in the existingImages array
        const { data: postData } = await supabase.from('posts').select('imageUrls').eq('slug', currentSlug).single();
        if (postData?.imageUrls) {
            const oldUrls = postData.imageUrls as string[];
            const urlsToDelete = oldUrls.filter(url => !existingImages.includes(url));
            const fileNamesToDelete = urlsToDelete.map(url => url.split('/').pop()).filter(Boolean) as string[];
            if (fileNamesToDelete.length > 0) {
                await supabase.storage.from(BUCKET_NAME).remove(fileNamesToDelete);
            }
        }
        
        const finalImageUrls = [...existingImages, ...newImageUrls];

        const updatedPost = {
            slug: slugify(title, { lower: true, strict: true }),
            title,
            excerpt,
            content,
            aiHint,
            imageUrls: finalImageUrls,
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
