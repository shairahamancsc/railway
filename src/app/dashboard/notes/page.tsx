
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";

// This is a server component, so we can fetch data directly
export default async function NotesPage() {
  // Supabase RLS should be configured to allow read access
  const { data: notes, error } = await supabase.from("notes").select();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold tracking-tight">
        Supabase Connection Test
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Notes from Database</CardTitle>
          <CardDescription>
            This page fetches data directly from your 'notes' table in Supabase.
            If you see a list of notes below, your connection is working correctly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
              <h3 className="font-bold">Error Fetching Data</h3>
              <p>{error.message}</p>
              <p className="mt-2 text-sm">Please ensure you have created the 'notes' table and enabled Row Level Security (RLS) with a read policy for public access in your Supabase project.</p>
            </div>
          )}
          {notes && notes.length > 0 && (
            <pre className="mt-4 rounded-md bg-muted p-4 text-sm">{JSON.stringify(notes, null, 2)}</pre>
          )}
           {notes && notes.length === 0 && !error && (
            <p className="text-muted-foreground">No notes found. Have you inserted the sample data?</p>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
