
"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useData } from "@/hooks/useData";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/types";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  selling_price: z.string().min(1, "Selling price is required"),
  discounted_price: z.string().optional(),
  hint: z.string().min(2, "AI hint must be at least 2 characters"),
  image: z.any()
    .refine((files) => files && (Array.isArray(files) ? files.length > 0 : true), "At least one image is required.")
});

interface ProductFormProps {
  onFinished: () => void;
  product?: Product | null;
}

export function ProductForm({ onFinished, product }: ProductFormProps) {
  const { addProduct, updateProduct } = useData();
  const { toast } = useToast();
  const isEditMode = !!product;
  const [isLoading, setIsLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>(product?.imageUrls || []);
  const imageRef =  useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      selling_price: product?.selling_price || "",
      discounted_price: product?.discounted_price || "",
      hint: product?.hint || "",
      image: product?.imageUrls || [],
    },
  });

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    setIsLoading(true);
    try {
      if (isEditMode && product) {
        await updateProduct(product.id, values);
        toast({ title: "Success!", description: "Product has been updated." });
      } else {
        await addProduct(values);
        toast({ title: "Success!", description: "New product has been created." });
      }
      onFinished();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      if (files.length > 0) {
          const currentImages = form.getValues('image') || [];
          form.setValue("image", [...currentImages, ...files]);
          
          const newPreviews = files.map(file => URL.createObjectURL(file));
          setPreviewImages(prev => [...prev, ...newPreviews]);
      }
  }

  const removeImage = (index: number, url: string) => {
    const currentImages = form.getValues('image') || [];
    const updatedImages = currentImages.filter((img: File | string, i: number) => {
        if(img instanceof File) {
            return URL.createObjectURL(img) !== url;
        }
        return img !== url;
    });

    form.setValue('image', updatedImages);
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Distribution Transformer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief description of the product..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="selling_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selling Price</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., ₹50,000 or Inquire" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discounted_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discounted Price (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., ₹45,000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <FormField
          control={form.control}
          name="hint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Image Hint</FormLabel>
              <FormControl>
                <Input placeholder="e.g., electrical transformer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Product Images</FormLabel>
                    <FormControl>
                        <div>
                             <Input 
                                type="file" 
                                className="hidden"
                                ref={imageRef}
                                onChange={handleImageChange}
                                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                                multiple
                             />
                             <Button type="button" variant="outline" onClick={() => imageRef.current?.click()}>
                                <Upload className="mr-2" />
                                Add Images
                             </Button>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        {previewImages.length > 0 && (
            <div>
                <FormLabel>Image Previews</FormLabel>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {previewImages.map((src, index) => (
                        <div key={index} className="relative group">
                            <Image src={src} alt={`Preview ${index}`} width={200} height={120} className="rounded-md object-cover w-full h-24" />
                             <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                                onClick={() => removeImage(index, src)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 animate-spin" />}
            {isLoading ? "Saving..." : isEditMode ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
