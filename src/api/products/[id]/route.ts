
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { z } from "zod";
import { zfd } from "zod-form-data";

const BUCKET_NAME = 'product-images';

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

// DELETE a product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const { data: productData } = await supabase.from('products').select('imageUrls').eq('id', id).single();
    if (productData?.imageUrls && productData.imageUrls.length > 0) {
        const fileNames = productData.imageUrls.map((url: string) => url.split('/').pop()).filter(Boolean) as string[];
        if (fileNames.length > 0) {
            await supabase.storage.from(BUCKET_NAME).remove(fileNames);
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
    selling_price: zfd.text(),
    discounted_price: zfd.text().optional(),
    hint: zfd.text(),
    image: z.union([zfd.file(), zfd.file().array(), zfd.text(), zfd.text().array()]),
});


export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const formData = await request.formData();
        const { name, description, selling_price, discounted_price, hint, image } = updateSchema.parse(formData);

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
        const { data: productData } = await supabase.from('products').select('imageUrls').eq('id', id).single();
        if (productData?.imageUrls) {
            const oldUrls = productData.imageUrls as string[];
            const urlsToDelete = oldUrls.filter(url => !existingImages.includes(url));
            const fileNamesToDelete = urlsToDelete.map(url => url.split('/').pop()).filter(Boolean) as string[];
            if (fileNamesToDelete.length > 0) {
                 await supabase.storage.from(BUCKET_NAME).remove(fileNamesToDelete);
            }
        }
        
        const finalImageUrls = [...existingImages, ...newImageUrls];

        const updatedProduct = {
            name,
            description,
            selling_price,
            discounted_price: discounted_price || null, // Ensure it's null if empty
            hint,
            imageUrls: finalImageUrls,
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
