
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Palette, Font, Image as ImageIcon } from "lucide-react";
import { useThemeCustomizer } from "@/context/ThemeCustomizerProvider";
import { Label } from "@/components/ui/label";

const fontOptions = [
  { label: "Poppins (Default)", value: "Poppins" },
  { label: "Inter", value: "Inter" },
  { label: "Roboto", value: "Roboto" },
  { label: "Lato", value: "Lato" },
  { label: "Montserrat", value: "Montserrat" },
  { label: "Open Sans", value: "Open Sans" },
];

const imageOptions = [
    { id: "heroImage", label: "Homepage Hero Background"},
]

export default function ThemePage() {
  const { theme, setTheme, resetTheme } = useThemeCustomizer();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      colors: theme.colors,
      fonts: theme.fonts,
      images: theme.images
    },
  });

  const onSubmit = (data: any) => {
    setTheme(data);
    toast({
      title: "Theme Saved!",
      description: "Your new theme settings have been applied.",
    });
    // Trigger a reload to ensure font changes apply correctly everywhere
    window.location.reload();
  };
  
  const handleReset = () => {
    resetTheme();
    toast({
      title: "Theme Reset",
      description: "The theme has been reset to its default settings.",
    });
     window.location.reload();
  }

  const handleImageChange = (id: string, file: File | null) => {
      if(file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            form.setValue(`images.${id}`, base64String);
        }
        reader.readAsDataURL(file);
      }
  }


  return (
    <div className="space-y-8">
       <div className="flex items-start gap-4">
        <Palette className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
        <div className="hidden md:block">
            <h1 className="text-3xl font-headline font-bold tracking-tight">
            Website Theme
            </h1>
            <p className="text-muted-foreground mt-1">
                Customize the look and feel of your public-facing website.
            </p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Color Scheme
              </CardTitle>
              <CardDescription>
                Choose the main colors for your website. Changes will be reflected live.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Object.entries(theme.colors).map(([name, value]) => (
                    <Controller
                        key={name}
                        name={`colors.${name}`}
                        control={form.control}
                        render={({ field }) => (
                           <FormItem>
                            <FormLabel className="capitalize">{name}</FormLabel>
                             <FormControl>
                               <div className="relative">
                                <Input type="color" {...field} className="p-1 h-12" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-sm uppercase text-muted-foreground">{field.value}</span>
                               </div>
                            </FormControl>
                           </FormItem>
                        )}
                    />
                ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Font className="h-5 w-5" />
                Typography
              </CardTitle>
              <CardDescription>
                Select the fonts for headings and body text.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fonts.headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline Font</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a font" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fontOptions.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fonts.body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body Font</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a font" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fontOptions.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Images
              </CardTitle>
              <CardDescription>
                Update the main images used on your public website.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {imageOptions.map((image) => (
                   <div key={image.id} className="space-y-2">
                        <Label>{image.label}</Label>
                        <div className="flex items-center gap-4">
                            <img src={form.watch(`images.${image.id}`)} alt="Preview" className="w-24 h-16 object-cover rounded-md border" />
                            <Input type="file" accept="image/*" onChange={(e) => handleImageChange(image.id, e.target.files ? e.target.files[0] : null)} />
                        </div>
                   </div>
                ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={handleReset}>Reset to Default</Button>
            <Button type="submit">Save Theme</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
