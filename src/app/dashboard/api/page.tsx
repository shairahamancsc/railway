
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Code } from "lucide-react";

export default function ApiPage() {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const endpoints = [
    {
      method: "GET",
      path: "/api/labourers",
      description: "Returns a list of all registered workers.",
    },
    {
      method: "GET",
      path: "/api/supervisors",
      description: "Returns a list of all registered supervisors.",
    },
    {
      method: "GET",
      path: "/api/attendance",
      description: "Returns all attendance records.",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Code className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-headline font-bold tracking-tight">
          API Endpoints
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Using the API</CardTitle>
          <CardDescription>
            You can use these endpoints to fetch data from your application programmatically.
            Simply make a GET request to the specified paths.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {endpoints.map((endpoint) => (
            <div key={endpoint.path} className="rounded-md border p-4">
                <div className="flex items-center gap-4">
                    <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded-md text-sm">{endpoint.method}</span>
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded-md">{endpoint.path}</code>
                </div>
                <p className="text-muted-foreground mt-2">{endpoint.description}</p>
                {baseUrl && (
                    <div className="mt-4">
                        <p className="text-xs font-semibold">Full URL:</p>
                        <a 
                            href={`${baseUrl}${endpoint.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary underline break-all"
                        >
                            {baseUrl}{endpoint.path}
                        </a>
                    </div>
                )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
