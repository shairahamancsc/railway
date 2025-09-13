
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { z } from "zod";
import { zfd } from "zod-form-data";
import slugify from "slugify";

export const dynamic = 'force-dynamic';

const BUCKET_NAME = 'product-images';

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

// GET all products
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error('Supabase error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST a new product
const postSchema = zfd.formData({
    name: zfd.text(),
    description: zfd.text(),
    selling_price: zfd.text(),
    discounted_price: zfd.text().optional(),
    hint: zfd.text(),
    image: z.union([zfd.file(), zfd.file().array()]),
});


export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const { name, description, selling_price, discounted_price, hint, image } = postSchema.parse(formData);
        
        const files = Array.isArray(image) ? image : [image];
        const imageUrls = (await Promise.all(files.map(file => uploadFile(file)))).filter(Boolean) as string[];


        if (imageUrls.length === 0) {
            return NextResponse.json({ error: 'Image upload failed.' }, { status: 500 });
        }
        
        const newProduct = {
            name,
            description,
            selling_price,
            discounted_price: discounted_price || null,
            hint,
            imageUrls,
        };

        const { data, error } = await supabase
            .from("products")
            .insert([newProduct])
            .select()
            .single();

        if (error) {
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
