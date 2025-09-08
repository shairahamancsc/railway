
"use client";

import { useState } from "react";
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
import type { Post } from "@/types";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(200, "Excerpt must be at most 200 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  aiHint: z.string().min(2, "AI hint must be at least 2 characters"),
  image: z.any()
    .refine((file) => file || typeof file === 'string', "Image is required.")
    .refine((file) => !file || typeof file === 'string' || file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
        (file) => !file || typeof file === 'string' || ACCEPTED_IMAGE_TYPES.includes(file?.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
});

interface BlogPostFormProps {
  onFinished: () => void;
  post?: Post | null;
}

export function BlogPostForm({ onFinished, post }: BlogPostFormProps) {
  const { addPost, updatePost } = useData();
  const { toast } = useToast();
  const isEditMode = !!post;
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(post?.imageUrl || null);
  const imageRef =  useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || "",
      excerpt: post?.excerpt || "",
      content: post?.content || "",
      aiHint: post?.aiHint || "",
      image: post?.imageUrl || null,
    },
  });

  const onSubmit = async (values: z.infer<typeof postSchema>) => {
    setIsLoading(true);
    try {
      if (isEditMode && post) {
        await updatePost(post.slug, values);
        toast({ title: "Success!", description: "Blog post has been updated." });
      } else {
        await addPost(values);
        toast({ title: "Success!", description: "New blog post has been created." });
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., The Future of Civil Engineering" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt / Short Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief summary of the post..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Write your blog post here..." {...field} rows={10} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="aiHint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Image Hint</FormLabel>
              <FormControl>
                <Input placeholder="e.g., construction site" {...field} />
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
                    <FormLabel>Featured Image</FormLabel>
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
            {isLoading ? "Saving..." : isEditMode ? "Save Changes" : "Create Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
