
"use client";

import { useState } from "react";
import { useData } from "@/hooks/useData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { BlogPostForm } from "@/components/dashboard/blog-post-form";
import type { Post } from "@/types";
import Image from "next/image";
import { format } from "date-fns";

export default function BlogManagementPage() {
  const { posts, deletePost, loading, error } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const { toast } = useToast();

  const handleEditClick = (post: Post) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingPost(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (slug: string) => {
    try {
      await deletePost(slug);
      toast({
        title: "Post Deleted",
        description: "The blog post has been removed.",
        variant: "destructive",
      });
    } catch {
      toast({
        title: "Error Deleting Post",
        description: "Could not remove the post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onFormFinished = () => {
    setIsFormOpen(false);
    setEditingPost(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="hidden md:block">
          <h1 className="text-3xl font-headline font-bold tracking-tight">
            Blog Management
          </h1>
          <p className="text-muted-foreground">
            Create, edit, and manage your blog posts.
          </p>
        </div>
        <Button onClick={handleAddNewClick}>
          <PlusCircle className="mr-2" />
          Add New Post
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
          <CardDescription>View and manage all your articles.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Excerpt</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Loading posts...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-red-500">
                      Error loading posts. Please refresh the page.
                    </TableCell>
                  </TableRow>
                ) : posts.length > 0 ? (
                  posts.map((post) => (
                    <TableRow key={post.slug}>
                      <TableCell>
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          width={80}
                          height={50}
                          className="rounded-md object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium max-w-xs truncate">
                        {post.title}
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-sm truncate">
                        {post.excerpt}
                      </TableCell>
                      <TableCell>
                        {format(new Date(post.date), "dd MMM, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditClick(post)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the post. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(post.slug)}
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No posts found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Edit Post" : "Create New Post"}
            </DialogTitle>
            <DialogDescription>
              {editingPost
                ? "Update the details of your blog post."
                : "Fill in the form to create a new blog post."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <BlogPostForm
              onFinished={onFormFinished}
              post={editingPost}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
