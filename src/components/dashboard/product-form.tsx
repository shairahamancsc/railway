
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
import { Loader2, Upload } from "lucide-react";
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
    .refine((file) => file || typeof file === 'string', "Image is required.")
    .refine((file) => !file || typeof file === 'string' || file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
        (file) => !file || typeof file === 'string' || ACCEPTED_IMAGE_TYPES.includes(file?.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
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
  const [previewImage, setPreviewImage] = useState<string | null>(product?.imageUrl || null);
  const imageRef =  useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      selling_price: product?.selling_price || "",
      discounted_price: product?.discounted_price || "",
      hint: product?.hint || "",
      image: product?.imageUrl || null,
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
      const file = event.target.files?.[0];
      if (file) {
          form.setValue("image", file);
          const reader = new FileReader();
          reader.onloadend = () => {
              setPreviewImage(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
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
                    <FormLabel>Product Image</FormLabel>
                    <FormControl>
                        <div>
                             <Input 
                                type="file" 
                                className="hidden"
                                ref={imageRef}
                                onChange={handleImageChange}
                                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                             />
                             <Button type="button" variant="outline" onClick={() => imageRef.current?.click()}>
                                <Upload className="mr-2" />
                                {field.value?.name || (isEditMode ? 'Change Image' : 'Upload Image')}
                             </Button>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        {previewImage && (
            <div>
                <FormLabel>Image Preview</FormLabel>
                <Image src={previewImage} alt="Preview" width={200} height={120} className="mt-2 rounded-md object-cover" />
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
