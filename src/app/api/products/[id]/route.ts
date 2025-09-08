
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { z } from "zod";
import { zfd } from "zod-form-data";

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

// DELETE a product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Optional: Delete the image from storage first
    const { data: productData } = await supabase.from('products').select('imageUrl').eq('id', id).single();
    if (productData?.imageUrl) {
        const fileName = productData.imageUrl.split('/').pop();
        if(fileName) {
            await supabase.storage.from(BUCKET_NAME).remove([fileName]);
        }
    }

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// UPDATE a product
const updateSchema = zfd.formData({
    name: zfd.text(),
    description: zfd.text(),
    price: zfd.text(),
    hint: zfd.text(),
    image: z.union([zfd.file(), zfd.text()]), // Can be new file or existing URL
});


export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const formData = await request.formData();
        const { name, description, price, hint, image } = updateSchema.parse(formData);

        let imageUrl: string;

        if (typeof image === 'string') {
            imageUrl = image; // Keep existing image
        } else {
             // Optional: Delete old image from storage
            const { data: productData } = await supabase.from('products').select('imageUrl').eq('id', id).single();
            if (productData?.imageUrl) {
                const oldFileName = productData.imageUrl.split('/').pop();
                if(oldFileName) await supabase.storage.from(BUCKET_NAME).remove([oldFileName]);
            }
            imageUrl = await uploadFile(image); // Upload new image
        }
        
        const updatedProduct = {
            name,
            description,
            price,
            hint,
            imageUrl,
        };

        const { data, error } = await supabase
            .from("products")
            .update(updatedProduct)
            .eq("id", id)
            .select()
            .single();

        if (error) {
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
